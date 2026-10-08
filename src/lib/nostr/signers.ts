import { type Event, type EventTemplate } from "nostr-tools";
import { parseBunkerInput, toBunkerURL, type BunkerPointer } from "nostr-tools/nip46";
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

/** Resolve any NIP-46 connection input (bunker:// URI, NIP-05 identifier, or remote signer pubkey) to a bunker pointer. */
export async function resolveBunkerPointer(
  input: string,
  fallbackRelays: string[] = []
): Promise<BunkerPointer | null> {
  const trimmed = input.trim();
  const normalized = trimmed.toLowerCase().startsWith("bunker://") ? trimmed : trimmed.toLowerCase();
  if (/^[0-9a-f]{64}$/.test(normalized)) {
    return { pubkey: normalized, relays: [...fallbackRelays], secret: null };
  }
  const pointer = await parseBunkerInput(normalized);
  if (!pointer?.pubkey) return null;
  // applesauce's bunker URI parser rejects URIs without relays, fall back to the client's relays
  if (pointer.relays.length === 0) pointer.relays = [...fallbackRelays];
  return pointer;
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

    const pointer = await resolveBunkerPointer(input, client.relayUrls);
    if (!pointer) throw new Error("No NIP-46 remote signer found for this address");

    const connectSigner = await NostrConnectSigner.fromBunkerURI(toBunkerURL(pointer), opts);

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
