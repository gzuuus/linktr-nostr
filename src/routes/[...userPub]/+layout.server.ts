import { NDKUser } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import { isNip05 } from "$lib/utils/helpers";

export async function load({ params }: any) {
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
  } else if (typeof userPub === "string" && !isNip05(userPub)) {
    const vanityNip05Build = `${userPub}@nostree.me`;
    try {
      const user = await NDKUser.fromNip05(vanityNip05Build);
      return {
        pubkey: user?.pubkey,
        segments,
        vanityNip05Build,
      };
    } catch (e) {
      console.log(e);
    }
  }
  const user = await NDKUser.fromNip05(userPub!);

  return {
    pubkey: user?.pubkey,
    segments,
  };
}
