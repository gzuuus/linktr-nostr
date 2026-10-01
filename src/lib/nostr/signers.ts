import { type Event, type EventTemplate } from "nostr-tools";
import { NIP05_REGEX } from "nostr-tools/nip05";
import { bytesToHex } from "@noble/hashes/utils";
import {
  ExtensionSigner,
  PrivateKeySigner as ApplesaucePrivateKeySigner,
  NostrConnectSigner,
} from "applesauce-signers";
import type { NostrClient, NostrUser } from "./client";

declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: EventTemplate): Promise<Event>;
    };
  }
}

export interface NostrSigner {
  getPublicKey(): Promise<string>;
  signEvent(template: EventTemplate): Promise<Event>;
  blockUntilReady(): Promise<void>;
  user(client: NostrClient): Promise<NostrUser>;
  close?(): Promise<void>;
}

export class Nip07Signer implements NostrSigner {
  private signer = new ExtensionSigner();

  async blockUntilReady(): Promise<void> {
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
      if (typeof window !== "undefined" && window.nostr) return;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error("NIP-07 extension not available");
  }

  async getPublicKey(): Promise<string> {
    return this.signer.getPublicKey();
  }

  async signEvent(template: EventTemplate): Promise<Event> {
    return this.signer.signEvent(template);
  }

  async user(client: NostrClient): Promise<NostrUser> {
    return client.getUser({ pubkey: await this.getPublicKey() });
  }
}

export class PrivateKeySigner implements NostrSigner {
  private signer: ApplesaucePrivateKeySigner;

  constructor(secretKeyHex?: string) {
    this.signer = secretKeyHex ? ApplesaucePrivateKeySigner.fromKey(secretKeyHex) : new ApplesaucePrivateKeySigner();
  }

  get privateKey(): string {
    return bytesToHex(this.signer.key);
  }

  get applesauceSigner(): ApplesaucePrivateKeySigner {
    return this.signer;
  }

  async blockUntilReady(): Promise<void> {}

  async getPublicKey(): Promise<string> {
    return this.signer.getPublicKey();
  }

  async signEvent(template: EventTemplate): Promise<Event> {
    return this.signer.signEvent(template);
  }

  async user(client: NostrClient): Promise<NostrUser> {
    return client.getUser({ pubkey: await this.getPublicKey() });
  }
}

type AuthUrlHandler = (url: string) => void;

/** Resolve a NIP-05 address to its NIP-46 bunker pointer (nostr.json "nip46" section). */
async function nip05ToBunkerURI(address: string): Promise<string | null> {
  const match = address.match(NIP05_REGEX);
  if (!match) return null;
  const [, name = "_", domain] = match;
  try {
    const res = await fetch(`https://${domain}/.well-known/nostr.json?name=${name}`);
    if (!res.ok) return null;
    const json = await res.json();
    const nip46 = json?.nip46;
    if (!nip46) return null;
    const pubkey = nip46.names?.[name] ?? nip46.names?.[name.toLowerCase()] ?? nip46.pubkey;
    const relays: string[] = nip46.relays ?? [];
    if (!pubkey || relays.length === 0) return null;
    const params = new URLSearchParams();
    for (const relay of relays) params.append("relay", relay);
    return `bunker://${pubkey}?${params.toString()}`;
  } catch {
    return null;
  }
}

function bunkerUriFromInput(input: string): string | null {
  const match = input.trim().match(/^bunker:\/\/([0-9a-f]{64})\??(.*)$/i);
  if (!match) return null;
  return `bunker://${match[1].toLowerCase()}?${match[2] ?? ""}`;
}

export class Nip46Signer implements NostrSigner {
  private connectSigner: NostrConnectSigner;
  readonly localSigner: PrivateKeySigner;
  remotePubkey: string | undefined;
  relayUrls: string[] | undefined;
  private authHandlers: AuthUrlHandler[] = [];
  readonly rpc = {
    on: (_event: "authUrl", handler: AuthUrlHandler) => {
      this.authHandlers.push(handler);
    },
  };

  private constructor(connectSigner: NostrConnectSigner, localSigner: PrivateKeySigner) {
    this.connectSigner = connectSigner;
    this.localSigner = localSigner;
    this.remotePubkey = connectSigner.remote;
    this.relayUrls = connectSigner.relays;
  }

  static async connect(client: NostrClient, input: string, localSigner: PrivateKeySigner): Promise<Nip46Signer> {
    const handlers: AuthUrlHandler[] = [];
    const opts = {
      signer: localSigner.applesauceSigner,
      pool: client.pool,
      onAuth: async (url: string) => {
        for (const handler of handlers) handler(url);
      },
    };

    let connectSigner: NostrConnectSigner;

    const bunkerUri = bunkerUriFromInput(input);
    const trimmed = input.trim();
    if (bunkerUri) {
      connectSigner = await NostrConnectSigner.fromBunkerURI(bunkerUri, opts);
    } else if (NIP05_REGEX.test(trimmed)) {
      const uri = await nip05ToBunkerURI(trimmed.toLowerCase());
      if (!uri) throw new Error("No NIP-46 remote signer found for this address");
      connectSigner = await NostrConnectSigner.fromBunkerURI(uri, opts);
    } else if (/^[0-9a-f]{64}$/i.test(trimmed)) {
      connectSigner = new NostrConnectSigner({
        ...opts,
        relays: [...client.relayUrls],
        remote: trimmed.toLowerCase(),
      });
    } else {
      throw new Error("Invalid NIP-46 connection string");
    }

    for (const relay of connectSigner.relays) client.addExplicitRelay(relay);
    const signer = new Nip46Signer(connectSigner, localSigner);
    signer.authHandlers = handlers;
    return signer;
  }

  async blockUntilReady(): Promise<void> {
    if (!this.connectSigner.isConnected) {
      await this.connectSigner.connect(this.connectSigner.bunkerSecret);
    }
  }

  async getPublicKey(): Promise<string> {
    return this.connectSigner.getPublicKey();
  }

  async signEvent(template: EventTemplate): Promise<Event> {
    return this.connectSigner.signEvent(template);
  }

  async user(client: NostrClient): Promise<NostrUser> {
    return client.getUser({ pubkey: await this.getPublicKey() });
  }

  async close(): Promise<void> {
    await this.connectSigner.close();
  }
}
