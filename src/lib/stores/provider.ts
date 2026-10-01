import { get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import { localStorageStore } from "./local-storage";
import { localStore } from "./stores";
import { fetchUserAssets, isNip05Valid } from "$lib/utils/helpers";
import { NostrClient, NostrUser } from "$lib/nostr/client";
import { Nip07Signer, Nip46Signer, PrivateKeySigner } from "$lib/nostr/signers";

export const localSignerStore: Writable<string> = localStorageStore("local-signer", "");
export const autoLoginStore: Writable<boolean> = localStorageStore("auto-login", false);

export const defaulRelaysUrls: string[] = [
  "wss://purplepag.es",
  "wss://relay.damus.io",
  "wss://relay.nostr.net",
  "wss://nos.lol",
];

const client = new NostrClient({
  relayUrls: defaulRelaysUrls,
});

export async function fetchUserData() {
  if (!client.signer) return;
  const user = await client.signer.user(client);
  await clientReady;
  await user.fetchProfile();
  await isNip05Valid(user.profile?.nip05, user.npub);
  activeUser.set(user);
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
    const signer = new Nip07Signer();
    console.log("Waiting for NIP-07 signer");
    await signer.blockUntilReady();
    await signer.user(client);
    client.signer = signer;

    await fetchUserData();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function loginWithNostrAddress(connectionString: string): Promise<boolean> {
  try {
    const localKey = get(localSignerStore) || undefined;
    const localSigner = new PrivateKeySigner(localKey);
    console.log("Local key", localSigner.privateKey);

    const signer = await Nip46Signer.connect(client, connectionString, localSigner);
    signer.rpc.on("authUrl", (url: string) => {
      window.open(url, "_blank", "width=600,height=600");
    });

    await signer.blockUntilReady();
    await signer.user(client);
    client.signer = signer;
    localSignerStore.set(localSigner.privateKey ?? "");
    await fetchUserData();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const activeUser = writable<NostrUser | undefined>(undefined);

export const clientReady: Promise<void> = browser
  ? client.connect().then(() => console.log("relay pool initialized successfully"))
  : Promise.resolve();

const nostrClientStore = writable(client);

export default nostrClientStore;
