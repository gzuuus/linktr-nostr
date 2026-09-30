import { nip19, type Event, type EventTemplate, type Filter } from "nostr-tools";
import { queryProfile } from "nostr-tools/nip05";
import { RelayPool } from "applesauce-relay";
import type { Subscription } from "rxjs";
import { lastValueFrom, toArray, defaultIfEmpty } from "rxjs";
import { writable, type Readable } from "svelte/store";
import type { NostrSigner } from "./signers";

export type NostrTag = string[];

export interface UserProfile {
  name?: string;
  displayName?: string;
  image?: string;
  picture?: string;
  banner?: string;
  about?: string;
  nip05?: string;
  lud16?: string;
  lud06?: string;
  website?: string;
  npub?: string;
  [key: string]: unknown;
}

export interface NostrClientOptions {
  relayUrls: string[];
}

function unixNow(): number {
  return Math.floor(Date.now() / 1000);
}

export class NostrUser {
  constructor(
    public readonly client: NostrClient,
    public readonly pubkey: string,
    public profile?: UserProfile,
  ) {}

  get npub(): string {
    return nip19.npubEncode(this.pubkey);
  }

  async fetchProfile(): Promise<UserProfile | undefined> {
    const events = await this.client.request(this.client.relayUrls, {
      kinds: [0],
      authors: [this.pubkey],
    });
    const latest = events.sort((a, b) => b.created_at - a.created_at)[0];
    if (!latest) return this.profile;
    try {
      const parsed = JSON.parse(latest.content) as UserProfile;
      parsed.image = parsed.image ?? parsed.picture;
      parsed.npub = this.npub;
      this.profile = parsed;
    } catch {
      this.profile = undefined;
    }
    return this.profile;
  }

  async follows(): Promise<Set<NostrUser>> {
    const events = await this.client.request(this.client.relayUrls, {
      kinds: [3],
      authors: [this.pubkey],
    });
    const latest = events.sort((a, b) => b.created_at - a.created_at)[0];
    const users = new Set<NostrUser>();
    if (!latest) return users;
    for (const tag of latest.tags) {
      if (tag[0] === "p" && tag[1]) users.add(this.client.getUser({ pubkey: tag[1] }));
    }
    return users;
  }

  async follow(target: NostrUser): Promise<boolean> {
    if (!this.client.signer) return false;
    const events = await this.client.request(this.client.relayUrls, {
      kinds: [3],
      authors: [this.pubkey],
    });
    const current = events.sort((a, b) => b.created_at - a.created_at)[0];
    const tags = current?.tags.filter((t) => t[0] === "p" && t[1]) ?? [];
    if (tags.some((t) => t[1] === target.pubkey)) return true;
    const event = new NostrEvent(this.client, {
      kind: 3,
      content: current?.content ?? "",
      tags: [...tags, ["p", target.pubkey]],
      created_at: unixNow(),
    });
    await event.publish();
    return true;
  }

  static async fromNip05(address: string, client: NostrClient): Promise<NostrUser | undefined> {
    const pointer = await queryProfile(address);
    if (!pointer?.pubkey) return undefined;
    return client.getUser({ pubkey: pointer.pubkey });
  }
}

export class NostrEvent {
  id = "";
  pubkey = "";
  sig: string | undefined = "";
  kind = 1;
  created_at = unixNow();
  tags: NostrTag[] = [];
  content = "";

  constructor(
    private client: NostrClient,
    raw?: Partial<Event>,
  ) {
    if (raw) {
      if (raw.id !== undefined) this.id = raw.id;
      if (raw.pubkey !== undefined) this.pubkey = raw.pubkey;
      if (raw.sig !== undefined) this.sig = raw.sig;
      if (raw.kind !== undefined) this.kind = raw.kind;
      if (raw.created_at !== undefined) this.created_at = raw.created_at;
      if (raw.tags !== undefined) this.tags = raw.tags.map((t) => [...t]);
      if (raw.content !== undefined) this.content = raw.content;
    }
  }

  get author(): NostrUser {
    return this.client.getUser({ pubkey: this.pubkey });
  }

  get relay(): { url: string } | undefined {
    return undefined;
  }

  tagValue(name: string): string | undefined {
    return this.tags.find((t) => t[0] === name)?.[1];
  }

  get dTagValue(): string | undefined {
    return this.tagValue("d");
  }

  rawEvent(): Event {
    return {
      id: this.id,
      pubkey: this.pubkey,
      sig: this.sig ?? "",
      kind: this.kind,
      created_at: this.created_at,
      tags: this.tags,
      content: this.content,
    };
  }

  toTemplate(): EventTemplate {
    return {
      kind: this.kind,
      created_at: this.created_at,
      tags: this.tags,
      content: this.content,
    };
  }

  async publish(): Promise<void> {
    const signer = this.client.signer;
    if (!signer) throw new Error("No signer available");
    if (!this.sig) {
      this.created_at = unixNow();
      const signed = await signer.signEvent(this.toTemplate());
      this.id = signed.id;
      this.pubkey = signed.pubkey;
      this.sig = signed.sig;
      this.created_at = signed.created_at;
    }
    const responses = await this.client.pool.publish(this.client.relayUrls, this.rawEvent());
    if (!responses.some((r) => r.ok)) {
      throw new Error(`Publish rejected by all relays: ${responses.map((r) => r.message).join(", ")}`);
    }
  }

  async delete(reason = ""): Promise<void> {
    const deletion = new NostrEvent(this.client);
    deletion.kind = 5;
    deletion.content = reason;
    deletion.tags = [["e", this.id]];
    const d = this.tagValue("d");
    if (this.kind >= 30000 && this.kind < 40000 && d !== undefined) {
      deletion.tags.push(["a", `${this.kind}:${this.pubkey}:${d}`]);
    }
    deletion.tags.push(["k", String(this.kind)]);
    await deletion.publish();
  }
}

export interface StoreSubscribeOptions {
  closeOnEose?: boolean;
  autoStart?: boolean;
  relays?: string[];
}

export class NostrEventStore implements Readable<NostrEvent[]> {
  private inner = writable<NostrEvent[]>([]);
  private sub: Subscription | undefined;
  private eoseCallbacks: (() => void)[] = [];
  private started = false;
  public eosed = false;
  readonly subscribe = this.inner.subscribe;

  constructor(
    private client: NostrClient,
    private filter: Filter,
    private opts: StoreSubscribeOptions = {},
  ) {
    if (opts.autoStart !== false) this.startSubscription();
  }

  startSubscription(): void {
    if (this.started) return;
    this.started = true;
    const relays = this.opts.relays ?? this.client.relayUrls;
    this.sub = this.client.pool.request(relays, this.filter).subscribe({
      next: (event) => {
        const wrapped = new NostrEvent(this.client, event);
        this.inner.update((list) => [...list, wrapped]);
      },
      complete: () => {
        this.eosed = true;
        for (const cb of this.eoseCallbacks) cb();
      },
      error: (err) => {
        console.error("Subscription error", err);
        this.eosed = true;
        for (const cb of this.eoseCallbacks) cb();
      },
    });
  }

  onEose(callback: () => void): void {
    if (this.eosed) callback();
    else this.eoseCallbacks.push(callback);
  }

  unsubscribe(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }
}

export class NostrClient {
  readonly pool = new RelayPool();
  relayUrls: string[];
  signer: NostrSigner | undefined;
  private users = new Map<string, NostrUser>();

  constructor(opts: NostrClientOptions) {
    this.relayUrls = [...opts.relayUrls];
  }

  async connect(): Promise<void> {
    for (const url of this.relayUrls) this.pool.relay(url);
  }

  addExplicitRelay(url: string): void {
    if (!this.relayUrls.includes(url)) this.relayUrls.push(url);
  }

  getUser({ pubkey }: { pubkey: string }): NostrUser {
    let user = this.users.get(pubkey);
    if (!user) {
      user = new NostrUser(this, pubkey);
      this.users.set(pubkey, user);
    }
    return user;
  }

  async getUserFromNip05(address: string): Promise<NostrUser | undefined> {
    return NostrUser.fromNip05(address, this);
  }

  async request(relays: string[], filter: Filter): Promise<Event[]> {
    return lastValueFrom(this.pool.request(relays, filter).pipe(toArray(), defaultIfEmpty([])));
  }

  async fetchEvent(filter: Filter, opts: { relays?: string[] } = {}): Promise<NostrEvent | null> {
    const events = await this.request(opts.relays ?? this.relayUrls, filter);
    const latest = events.sort((a, b) => b.created_at - a.created_at)[0];
    return latest ? new NostrEvent(this, latest) : null;
  }

  async fetchEvents(filter: Filter, opts: { relays?: string[] } = {}): Promise<NostrEvent[]> {
    const events = await this.request(opts.relays ?? this.relayUrls, filter);
    return events.map((event) => new NostrEvent(this, event));
  }

  storeSubscribe(filter: Filter, opts: StoreSubscribeOptions = {}): NostrEventStore {
    return new NostrEventStore(this, filter, opts);
  }

  async publish(event: NostrEvent): Promise<void> {
    await event.publish();
  }
}
