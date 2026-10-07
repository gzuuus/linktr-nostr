import { expect, test } from "@playwright/test";
import { toBunkerURL, useFetchImplementation } from "nostr-tools/nip46";
import { NostrConnectSigner } from "applesauce-signers";
import { resolveBunkerPointer, PrivateKeySigner } from "../src/lib/nostr/signers";
import { NostrClient, NostrEvent } from "../src/lib/nostr/client";

const PK = "b0635d6a9851d3aed0cd6c495b282167acf761729078d975fc341b22650b07b9";

test("bunker:// URI resolves and round-trips through applesauce parser", async () => {
  const input = `bunker://${PK}?relay=${encodeURIComponent("wss://relay.nsec.app")}&secret=abc123`;
  const pointer = await resolveBunkerPointer(input, []);
  expect(pointer).toEqual({ pubkey: PK, relays: ["wss://relay.nsec.app"], secret: "abc123" });

  const parsed = NostrConnectSigner.parseBunkerURI(toBunkerURL(pointer!));
  expect(parsed.remote).toBe(PK);
  expect(parsed.relays).toEqual(["wss://relay.nsec.app"]);
  expect(parsed.bunkerSecret).toBe("abc123");
});

test("NIP-05 identifier resolves via names + nip46[pubkey]", async () => {
  useFetchImplementation(async () => ({
    json: async () => ({ names: { bob: PK }, nip46: { [PK]: ["wss://relay.nsec.app"] } }),
  }));
  try {
    const pointer = await resolveBunkerPointer("bob@example.com", []);
    expect(pointer).toEqual({ pubkey: PK, relays: ["wss://relay.nsec.app"], secret: null });
  } finally {
    useFetchImplementation(fetch);
  }
});

test("NIP-05 identifier without a nip46 section resolves to null", async () => {
  useFetchImplementation(async () => ({
    json: async () => ({ names: { bob: PK } }),
  }));
  try {
    expect(await resolveBunkerPointer("bob@example.com", [])).toBeNull();
  } finally {
    useFetchImplementation(fetch);
  }
});

test("remote signer pubkey falls back to the client relays", async () => {
  expect(await resolveBunkerPointer(PK, ["wss://nos.lol"])).toEqual({
    pubkey: PK,
    relays: ["wss://nos.lol"],
    secret: null,
  });
});

test("delete() emits NIP-09 tags for addressable events", async () => {
  type PublishedEvent = { id: string; pubkey: string; kind: number; content: string; tags: string[][] };
  const client = new NostrClient({ relayUrls: [] });
  client.signer = new PrivateKeySigner("11".repeat(32));
  const published: PublishedEvent[] = [];
  const pool = client.pool as unknown as {
    publish: (relays: string[], event: PublishedEvent) => Promise<{ ok: boolean; from: string }[]>;
  };
  pool.publish = async (_relays, event) => {
    published.push(event);
    return [{ ok: true, from: "test" }];
  };

  const event = new NostrEvent(client, { kind: 30003, tags: [["d", "slug"]], content: "list" });
  await event.publish();
  await event.delete("gone");

  expect(published).toHaveLength(2);
  const [list, deletion] = published;
  expect(deletion.kind).toBe(5);
  expect(deletion.content).toBe("gone");
  expect(deletion.tags).toContainEqual(["e", list.id]);
  expect(deletion.tags).toContainEqual(["a", `30003:${list.pubkey}:slug`]);
  expect(deletion.tags).toContainEqual(["k", "30003"]);
});
