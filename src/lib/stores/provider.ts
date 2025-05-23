import { get, writable, type Writable } from "svelte/store";
import { NDKNip07Signer, NDKPrivateKeySigner, NDKNip46Signer } from "@nostr-dev-kit/ndk";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { bytesToHex } from "@noble/hashes/utils";
import { generateSecretKey } from "nostr-tools/pure";
import { localStorageStore } from "@skeletonlabs/skeleton";
import { localStore } from "./stores";
import { fetchUserAssets, isNip05Valid } from "$lib/utils/helpers";
import { NIP05_REGEX } from "nostr-tools/nip05";
export const localSignerStore: Writable<string> = localStorageStore("local-signer", "");
export const autoLoginStore: Writable<boolean> = localStorageStore("auto-login", false);

export const defaulRelaysUrls: string[] = [
  "wss://purplepag.es",
  "wss://relay.nostr.band",
  "wss://nos.lol",
];

const ndk = new NDKSvelte({
  explicitRelayUrls: defaulRelaysUrls,
  outboxRelayUrls: ["wss://purplepag.es"],
  enableOutboxModel: true,
});

export async function fetchUserData() {
  if (!ndk.signer) return;
  const user = await ndk.signer.user();
  await user.fetchProfile();
  await isNip05Valid(user.profile?.nip05, user.npub);
  ndkActiveUser.set(user);
  fetchUserAssets(user);
  console.log("Fetched user", user);
  localStore.update((current) => {
    return {
      ...current,
      lastUserLogged: user?.pubkey,
    };
  });
}

export async function loginWithExtension(): Promise<boolean> {
  try {
    const signer = new NDKNip07Signer();
    console.log("Waiting for NIP-07 signer");
    await signer.blockUntilReady();
    await signer.user();
    ndk.signer = signer;

    await fetchUserData();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function loginWithNostrAddress(connectionString: string): Promise<boolean> {
  try {
    const localKey = get(localSignerStore) || bytesToHex(generateSecretKey());
    console.log("Local key", localKey);
    const localSigner = new NDKPrivateKeySigner(localKey);

    let signer: NDKNip46Signer;

    if (NIP05_REGEX.test(connectionString)) {
      connectionString.endsWith("@nsec.app") && ndk.addExplicitRelay("wss://relay.nsec.app");
      const user = await ndk.getUserFromNip05(connectionString.toLowerCase());
      if (!user?.pubkey) throw new Error("Cant find user");
      signer = new NDKNip46Signer(ndk, connectionString, localSigner);
      signer.remoteUser = user;
      signer.remotePubkey = user.pubkey;
    } else if (connectionString.startsWith("bunker://")) {
      const uri = new URL(connectionString);

      const pubkey = uri.host || uri.pathname.replace("//", "");
      const relays = uri.searchParams.getAll("relay");
      for (let relay of relays) ndk.addExplicitRelay(relay);
      if (relays.length == 0) throw new Error("Missing relays");
      signer = new NDKNip46Signer(ndk, pubkey, localSigner);
      signer.relayUrls = relays;
    } else {
      signer = new NDKNip46Signer(ndk, connectionString, localSigner);
    }
    signer.rpc.on("authUrl", (url: string) => {
      window.open(url, "_blank", "width=600,height=600");
    });

    await signer.blockUntilReady();
    await signer.user();
    ndk.signer = signer;
    localSignerStore.set(localSigner.privateKey ?? "");
    await fetchUserData();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const ndkActiveUser = writable(ndk.activeUser);

ndk.connect().then(() => console.log("ndk connected successfully"));

const ndkStore = writable(ndk);

export default ndkStore;
