import { get, writable, type Writable } from "svelte/store";
import { NDKNip07Signer, type NDKCacheAdapter, NDKPrivateKeySigner, NDKNip46Signer } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { browser } from "$app/environment";
import NDKSvelte from "@nostr-dev-kit/ndk-svelte";
import { bytesToHex } from "@noble/hashes/utils";
import { generateSecretKey } from "nostr-tools";
import { localStorageStore } from "@skeletonlabs/skeleton";
import { emailRegex } from "$lib/utils/constants";
export const localSignerStore: Writable<string> = localStorageStore("local-signer", "");
export const autoLoginStore: Writable<string> = localStorageStore("auto-login", "");

let cacheAdapter: NDKCacheAdapter | undefined;

if (browser) {
  cacheAdapter = new NDKCacheAdapterDexie({
    dbName: "nostreeV02",
  });
}

export const defaulRelaysUrls: string[] = [
  "wss://purplepag.es",
  "wss://relay.nostr.band",
  "wss://nos.lol",
  "wss://bouncer.nostree.me",
];

const ndk = new NDKSvelte({
  explicitRelayUrls: defaulRelaysUrls,
  cacheAdapter,
  enableOutboxModel: false,
});

export async function fetchUserData() {
  // TODO add fetchCssAssets and so on
  if (!ndk.signer) return;

  console.log("Fetching user");
  const user = await ndk.signer.user();
  console.log("Fetching profile");
  await user.fetchProfile();
  console.log(user);
  ndkActiveUser.set(user);
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

    // manually set remote user and pubkey if using NIP05
    if (emailRegex.test(connectionString)) {
      const user = await ndk.getUserFromNip05(connectionString);
      if (!user?.pubkey) throw new Error("Cant find user");
      signer = new NDKNip46Signer(ndk, connectionString, localSigner);
      signer.remoteUser = user;
      signer.remotePubkey = user.pubkey;
    } else if (connectionString.startsWith("bunker://" || "nsecbunker://")) {
      const uri = new URL(connectionString);

      const pubkey = uri.host || uri.pathname.replace("//", "");
      const relays = uri.searchParams.getAll("relay");
      for (let relay of relays) ndk.addExplicitRelay(relay);
      if (relays.length === 0) throw new Error("Missing relays");
      signer = new NDKNip46Signer(ndk, pubkey, localSigner);
      signer.relayUrls = relays;
    } else {
      signer = new NDKNip46Signer(ndk, connectionString, localSigner);
    }
    signer.rpc.on("authUrl", (url: string) => {
      window.open(url, "_blank");
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
