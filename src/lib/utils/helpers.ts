import { nip19 } from "nostr-tools";
import { NDKUser, NDKEvent, type NDKTag } from "@nostr-dev-kit/ndk";
import { ndkUser } from "$lib/stores/user";
import { goto } from "$app/navigation";
import { nanoid } from "nanoid";
import { isNip05Valid as isNip05ValidStore } from "$lib/stores/user";
import { defaulTheme, outNostrLinksUrl } from "./constants";
import { storeTheme } from "$lib/stores/stores";
export function unixTimeNow() {
  return Math.floor(new Date().getTime() / 1000);
}

export function dateTomorrow() {
  return new Date(Date.now() + 3600 * 1000 * 24);
}

export function isNip05(input: string | undefined): boolean {
  if (input === undefined) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

export async function isNip05Valid(nip05: string | undefined = "", npub: string | undefined = ""): Promise<boolean> {
  try {
    if (!isNip05(nip05)) {
      isNip05ValidStore.set({
        isNip05Valid: false,
        Nip05address: undefined,
        UserNpub: npub,
        Vanity: undefined,
        UserIdentifier: npub,
      });
      return false;
    }

    const nip05Promise = await NDKUser.fromNip05(nip05.toLowerCase());
    const isNip05Valid = nip05Promise !== undefined;
    const Nip05address = nip05;
    const UserNpub = isNip05Valid ? nip05Promise.npub : npub;

    if (isNip05(Nip05address) && Nip05address.split("@")[1] == "nostree.me") {
      isNip05ValidStore.set({
        isNip05Valid,
        Nip05address,
        UserNpub,
        Vanity: Nip05address.split("@")[0],
        UserIdentifier: Nip05address.split("@")[0],
      });
      return isNip05Valid;
    }

    if (nip05Promise === undefined && UserNpub.startsWith("npub")) {
      isNip05ValidStore.set({
        isNip05Valid: true,
        Nip05address,
        UserNpub,
        Vanity: undefined,
        UserIdentifier: Nip05address,
      });
      return isNip05Valid;
    }

    isNip05ValidStore.set({
      isNip05Valid,
      Nip05address,
      UserNpub,
      Vanity: undefined,
      UserIdentifier: Nip05address,
    });

    return isNip05Valid;
  } catch (error) {
    isNip05ValidStore.set({
      isNip05Valid: false,
      Nip05address: undefined,
      UserNpub: npub,
      Vanity: undefined,
      UserIdentifier: npub,
    });
    return false;
  }
}

export function unixToDate(unixTimestamp: number | undefined) {
  if (unixTimestamp === undefined) {
    return "";
  }
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date(unixTimestamp * 1000).toLocaleString("en-US", options);
}

export function buildEventPointer(
  id: string | undefined = "",
  relays: string[] | undefined = [],
  author: string,
  kind?: number,
  identifier: string | undefined = ""
) {
  let objPointer: any;
  let encodedPointer: string = "";
  if (kind === 1) {
    objPointer = {
      id: id,
      relays: relays,
      author: author,
    };
    return (encodedPointer = nip19.neventEncode(objPointer));
  } else if (kind === 30023 || kind === 30001) {
    objPointer = {
      identifier: identifier,
      pubkey: author,
      kind: kind,
      relays: relays,
    };
    return (encodedPointer = nip19.naddrEncode(objPointer));
  }
}
export function buildATags(
  id: string | undefined = "",
  relays: string[] | undefined = [],
  author: string,
  kind?: number,
  identifier: string | undefined = ""
) {
  let objPointer: any;
  let encodedPointer: string[] = [""];
  if (kind === 30023 || kind === 30001) {
    objPointer = {
      identifier: identifier,
      pubkey: author,
      kind: kind,
      relays: relays,
    };
    return (encodedPointer = [
      `${objPointer.kind}:${objPointer.pubkey}:${objPointer.identifier}`,
      nip19.naddrEncode(objPointer),
    ]);
  }
}

export function naddrEncodeATags(EventPointer: string) {
  let objPointer = EventPointer.split(":");
  let eventKind: number = parseInt(objPointer[0]);
  let eventAuthor: string = objPointer[1];
  let eventIdentifier: string = objPointer[2];

  return buildEventPointer(undefined, [], eventAuthor, eventKind, eventIdentifier);
}

export function decodeEventPointer(encodedPointer: string) {
  const objPointer = nip19.decode(encodedPointer);
  return objPointer;
}

export function findListTags(tags: NDKTag[]) {
  const matchingTags = tags.filter((tag) => tag[0] == "r");

  return matchingTags.map((tag) => {
    const [url, text] = tag.slice(1);
    return { url, text } as { url: string; text: string };
  });
}

export function findHashTags(tags: NDKTag[]) {
  const matchingTags = tags.filter((tag) => tag[0] == "t");

  return matchingTags.map((tag) => {
    const [text] = tag.slice(1);
    return { text } as { text: string };
  });
}
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
export function findOtherTags(tags: NDKTag[], tagName: string) {
  const matchingTags = tags.filter((tag) => tag[0] === tagName);

  return matchingTags.map((tag) => {
    const [tagValue] = tag.slice(1);
    return tagValue as string;
  });
}
export function parseNostrUrls(rawContent: string): string {
  const nostrPattern = /nostr:(nprofile|nevent|naddr|npub1)(\w+)/g;

  return rawContent.replace(nostrPattern, (match, type, id) => {
    let nostrEntity = type + id;
    let nostrEntityUrl = `${outNostrLinksUrl}/${nostrEntity}`;

    switch (type) {
      case "nprofile":
        return `${nostrEntityUrl}`;
      case "nevent":
      case "naddr":
        return `${nostrEntityUrl}`;
      default:
        return match;
    }
  });
}

export function truncateString(str?: string): string {
  if (str === undefined) {
    return "";
  } else {
    return str.substring(0, 12) + ":" + str.substring(str.length - 6);
  }
}

export function truncatedBech(bech32: string, length?: number): string {
  return `${bech32.substring(0, length || 9)}...`;
}

export async function copyToClipboard(textToCopy: string) {
  try {
    await navigator.clipboard.writeText(textToCopy);
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

export async function sharePage(urlToShare: string) {
  if (navigator && typeof navigator !== "undefined" && "share" in navigator && typeof navigator.share === "function") {
    let url = urlToShare;
    try {
      await navigator.share({
        url,
      });
      return true;
    } catch (error) {
      console.error("Error :", error);
    }
  } else {
    copyToClipboard(urlToShare);
    return true;
  }
}

export function logout() {
  ndkUser.set(null);
  isNip05ValidStore.set({
    isNip05Valid: null,
    Nip05address: undefined,
    UserNpub: undefined,
    Vanity: undefined,
    UserIdentifier: undefined,
  });
  storeTheme.set(defaulTheme);
  document.body.setAttribute("data-theme", defaulTheme);
  goto("/");
}

export function sortEventList(eventList: NDKEvent[]) {
  eventList.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
}

export function generateNanoId(seed: string | undefined = unixTimeNow().toString()) {
  const userID = seed.slice(-3);
  const id = nanoid(6);
  return userID + id;
}
