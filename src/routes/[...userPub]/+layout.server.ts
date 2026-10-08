import nostrClientStore from "$lib/stores/provider";
import { NostrUser } from "$lib/nostr/client";
import { nip19 } from "nostr-tools";
import { NIP05_REGEX } from "nostr-tools/nip05";
import { get } from "svelte/store";

export async function load({ params }: any) {
  const client = get(nostrClientStore);
  const segments = params.userPub.split("/");
  const userPub: string | undefined = segments.shift();
  if (userPub?.startsWith("npub")) {
    return { pubkey: nip19.decode(userPub).data, segments };
  } else if (userPub?.startsWith("nprofile")) {
    const decodedData = nip19.decode(userPub).data;
    if (typeof decodedData === "object" && "pubkey" in decodedData) {
      return {
        pubkey: decodedData.pubkey,
        segments,
      };
    }
  } else if (userPub && !NIP05_REGEX.test(userPub)) {
    const vanityNip05Build = `${userPub}@nostree.me`;
    try {
      const user = await NostrUser.fromNip05(vanityNip05Build, client);
      return {
        pubkey: user?.pubkey,
        segments,
        vanityNip05Build,
      };
    } catch (e) {
      console.log(e);
    }
  }
  const user = await NostrUser.fromNip05(userPub!, client);

  return {
    pubkey: user?.pubkey,
    segments,
  };
}
