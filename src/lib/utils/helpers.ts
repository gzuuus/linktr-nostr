import { nip19 } from "nostr-tools";
import {
  NDKUser,
  NDKEvent,
  type NDKTag,
  type NDKUserProfile,
  type NDKFilter,
  NDKKind,
  NDKNip07Signer,
} from "@nostr-dev-kit/ndk";
import { currentUserFollows, userCustomTheme } from "$lib/stores/user";
import { autoLoginStore, localSignerStore, ndkActiveUser } from "$lib/stores/provider";
import { goto } from "$app/navigation";
import { nanoid } from "nanoid";
import { isNip05Valid as isNip05ValidStore } from "$lib/stores/user";
import {
  CORSproxyUrl,
  defaulTheme,
  emailRegex,
  kindArticles,
  kindCSSReplaceableAsset,
  kindLinks,
  kindNotes,
  outNostrLinksUrl,
  validPrefixes,
} from "./constants";
import { storeTheme } from "$lib/stores/stores";
import { browser } from "$app/environment";
import { db } from "@nostr-dev-kit/ndk-cache-dexie";
import { get as getStore } from "svelte/store";
import ndkStore from "$lib/stores/provider";
import { localStore } from "$lib/stores/stores";
import type { Link } from "$lib/classes/list";
import { type AddressPointer, type EventPointer } from "nostr-tools/nip19";
export function unixTimeNow() {
  return Math.floor(new Date().getTime() / 1000);
}

export function dateTomorrow() {
  return new Date(Date.now() + 3600 * 1000 * 24);
}

// export function isNip05(input: string | undefined): boolean {
//   if (input === undefined) {
//     return false;
//   }
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(input);
// }

export function parseNip05Address(address: string): { name?: string; domain?: string } {
  const parts = address.trim().toLowerCase().split("@");
  return { name: parts[0], domain: parts[1] };
}
interface nip05response {
  names: { [name: string]: string };
  nip46?: string;
}
export async function fetchWithFallback(address: string): Promise<nip05response | undefined> {
  const { name, domain } = parseNip05Address(address);
  if (!name || !domain) throw new Error("invalid address");
  const fetchUrl = `https://${domain}/.well-known/nostr.json?name=${name}`;
  try {
    const response = await fetch(fetchUrl);
    let json = (await response.json()) as nip05response;
    if (json.names[name]) {
      json.names = { [name]: json.names[name] };
    } else return undefined;
    return json;
  } catch (error) {
    if (error instanceof Error && error.message.includes("CORS")) {
      const response = await fetch(CORSproxyUrl + fetchUrl);
      let json = (await response.json()) as nip05response;
      if (json.names[name]) {
        json.names = { [name]: json.names[name] };
      } else return undefined;
      return json;
    } else {
      throw error;
    }
  }
}
// export async function fetchNip05withCors(address: string) {
//   const { name, domain } = parseNip05Address(address);
//   if (!name || !domain) throw new Error("invalid address");

//   const json = await fetchWithCorsFallback(`https://${domain}/.well-known/nostr.json?name=${name}`)
//     .then((res) => res.json() as Promise<IdentityJson>)
//     .then((json) => {
//       // convert all keys in names, and relays to lower case
//       if (json.names) {
//         for (const [name, pubkey] of Object.entries(json.names)) {
//           delete json.names[name];
//           json.names[name.toLowerCase()] = pubkey;
//         }
//       }
//       if (json.relays) {
//         for (const [name, pubkey] of Object.entries(json.relays)) {
//           delete json.relays[name];
//           json.relays[name.toLowerCase()] = pubkey;
//         }
//       }
//       return json;
//     });

//   await this.addToCache(domain, json);

//   return getIdentityFromJson(name, domain, json);
// }

export async function isNip05Valid(nip05: string | undefined = "", npub: string | undefined = ""): Promise<boolean> {
  !npub.startsWith("npub") && (npub = nip19.npubEncode(npub));
  try {
    if (!emailRegex.test(nip05)) {
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

    if (emailRegex.test(Nip05address) && Nip05address.split("@")[1] == "nostree.me") {
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
      isNip05Valid: true,
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

export function propsBuildPointer(
  id: string | undefined = "",
  relays: string[] | undefined = [],
  author: string,
  kind?: number,
  identifier: string | undefined = ""
): string {
  const objPointer: EventPointer | AddressPointer =
    kind === kindNotes ? { id, relays, author, kind } : { identifier, pubkey: author, kind: kind || 0, relays };

  return kind === kindNotes
    ? nip19.neventEncode(objPointer as EventPointer)
    : nip19.naddrEncode(objPointer as AddressPointer);
}

export function buildEventPointer(event: NDKEvent) {
  let objPointer: EventPointer | AddressPointer;
  let encodedPointer: string;
  if (event.kind == kindNotes) {
    objPointer = {
      id: event.id,
      relays: [event.relay?.url ?? ""],
      author: event.author.pubkey,
    };
    return (encodedPointer = nip19.neventEncode(objPointer));
  } else if (event.kind == kindLinks || event.kind == kindArticles || event.kind == kindLinks) {
    console.log(event.tagValue("d")!, event.author.pubkey, event.kind, event.relay?.url);
    objPointer = {
      identifier: event.tagValue("d")!,
      pubkey: event.author.pubkey,
      kind: event.kind,
      relays: event.relay?.url ? [event.relay?.url] : [],
    };
    return (encodedPointer = nip19.naddrEncode(objPointer));
  }
}
export function buildATags(author: string, kind: number, identifier: string): string {
  const objPointer: AddressPointer = {
    identifier,
    pubkey: author,
    kind,
  };
  return `${objPointer.kind}:${objPointer.pubkey}:${objPointer.identifier}`;
}

export function naddrEncodeATags(EventPointer: string) {
  let objPointer = EventPointer.split(":");
  let eventKind: number = parseInt(objPointer[0]);
  let eventAuthor: string = objPointer[1];
  let eventIdentifier: string = objPointer[2];

  return propsBuildPointer(undefined, [], eventAuthor, eventKind, eventIdentifier);
}

export function decodeEventPointer(encodedPointer: string) {
  const objPointer = nip19.decode(encodedPointer);
  return objPointer;
}

export function findListTags(tags: NDKTag[]) {
  const matchingTags = tags.filter((tag) => tag[0] == "r");
  return matchingTags.map((tag) => {
    const [url, description] = tag.slice(1);
    return { url, description } as Link;
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

export function findSlugTag(event: NDKEvent): string {
  const matchingTags = event.tags.filter((tag) => tag[0] == "l");
  let slugTag = matchingTags.filter((tag) => tag[1] != "nostree")[0];
  return slugTag[1];
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

export function truncateString(str: string): string {
  return str.substring(0, 12) + ":" + str.substring(str.length - 6);
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
  localStorage.clear();
  location.reload();
}

export function sortEventList(eventList: NDKEvent[]) {
  eventList.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
}

export function generateNanoId(seed: string | undefined = unixTimeNow().toString()) {
  const userID = seed.slice(-3);
  const id = nanoid(6);
  return userID + id;
}

export function setCustomStyles(cssTheme: string) {
  let styleTag = document.createElement("style");
  styleTag.id = "custom-style";
  styleTag.textContent = `${cssTheme}`;
  document.head.appendChild(styleTag);
}

export async function fetchUserProfile(opts: string): Promise<NDKUserProfile | undefined> {
  try {
    if (browser) {
      const user = await db.users.where({ pubkey: opts }).first();
      if (!user) {
        const ndk = getStore(ndkStore);
        const ndkUser = ndk.getUser({ pubkey: opts });

        await ndkUser.fetchProfile({
          closeOnEose: true,
          groupable: false,
          groupableDelay: 200,
        });
        return ndkUser.profile as NDKUserProfile;
      } else {
        return user.profile as NDKUserProfile;
      }
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchCssAsset(user: string) {
  const $ndk = getStore(ndkStore);
  const $ndkActiveUser = getStore(ndkActiveUser);
  const $storeTheme = getStore(storeTheme);
  let ndkFilter: NDKFilter = {
    authors: [user],
    kinds: [kindCSSReplaceableAsset as NDKKind],
    "#L": ["nostree-theme"],
  };
  try {
    // TODO: use cache
    const fetchedEvent = await $ndk.fetchEvent(ndkFilter, {
      closeOnEose: true,
      groupable: true,
    });

    if (fetchedEvent) {
      const userTheme = fetchedEvent.tagValue("l");
      const themeIdentifier = fetchedEvent.tagValue("d");
      const themeCustomCss = fetchedEvent.content;

      if (user == $ndkActiveUser?.pubkey) {
        userCustomTheme.set({
          UserTheme: userTheme || undefined,
          themeIdentifier: themeIdentifier || undefined,
          themeCustomCss: themeCustomCss || undefined,
        });
        localStore.update((currentState) => {
          return {
            lastUserLogged: currentState.lastUserLogged,
            lastUserTheme: userTheme,
            currentUserFollows: currentState.currentUserFollows,
            UserIdentifier: currentState.UserIdentifier,
          };
        });

        storeTheme.set($storeTheme == defaulTheme ? userTheme! : $storeTheme);
      } else {
        storeTheme.set(userTheme || "");
      }

      if (fetchedEvent.content) {
        setCustomStyles(fetchedEvent.content);
      }
    } else {
      if (user == $ndkActiveUser?.pubkey) {
        localStore.update((currentState) => {
          return {
            lastUserLogged: currentState.lastUserLogged,
            lastUserTheme: undefined,
            currentUserFollows: currentState.currentUserFollows,
            UserIdentifier: currentState.UserIdentifier,
          };
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// export async function NDKlogin(): Promise<NDKUser | undefined> {
//   try {
//     const $ndk = getStore(ndkStore);
//     const signer = new NDKNip07Signer();
//     $ndk.signer = signer;
//     ndkStore.set($ndk);
//     const ndkCurrentUser = await signer.user();
//     let user = $ndk.getUser({
//       npub: ndkCurrentUser.npub,
//     });
//     ndkActiveUser.set(user);
//     const followsSet = await user.follows();
//     const followsArray = Array.from(followsSet as Set<NDKUser>);
//     currentUserFollows.set(followsArray.map((user) => user.pubkey));
//     const userProfile = await user.fetchProfile();
//     await isNip05Valid(userProfile?.nip05, user.npub);
//     const nip05ValidStore = getStore(isNip05ValidStore);
//     localStore.update((currentState) => {
//       return {
//         lastUserLogged: ndkCurrentUser.npub,
//         lastUserTheme: currentState.lastUserTheme,
//         currentUserFollows: followsArray.map((user) => user.pubkey),
//         UserIdentifier: nip05ValidStore.UserIdentifier,
//       };
//     });
//     await fetchCssAsset(user.pubkey);
//     return user;
//   } catch (error) {
//     return undefined;
//   }
// }

export function processHashtags(events: NDKEvent[]): string[] {
  const newHashtagsSet = new Set<string>();

  events.forEach((event) => {
    const newHashtags = event.tags.flatMap((tag: string[]) =>
      tag[0] === "t" && !newHashtagsSet.has(tag[1]) ? [tag[1]] : []
    );

    if (newHashtags.length > 0) {
      newHashtags.forEach((tag) => newHashtagsSet.add(tag));
    }
  });

  return [...newHashtagsSet];
}

export async function fetchUserEvents(userPubKey: string): Promise<NDKEvent[]> {
  const $ndk = getStore(ndkStore);
  let fetchedEvent = await $ndk.fetchEvents({
    kinds: [kindLinks],
    authors: [userPubKey],
    "#l": ["nostree"],
  });
  let events = Array.from(fetchedEvent);
  return events;
}

export function validateURL(url: string): boolean {
  return validPrefixes.some((prefix) => url.startsWith(prefix));
}

export function validateURLTitle(title: string): boolean {
  return title.trim() !== "";
}
export async function addLinkToList(link: Link, eventToModify: NDKEvent): Promise<boolean> {
  const $ndk = getStore(ndkStore);

  let linkTag = ["r", link.url, link.description];
  try {
    if (!$ndk.signer) return false;
    let eventToPublish = eventToModify;
    eventToPublish.sig = undefined;
    eventToPublish.created_at = unixTimeNow();
    eventToPublish.tags.push(linkTag);
    await eventToPublish.publish();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function publishKind1(content: string): Promise<boolean> {
  const $ndk = getStore(ndkStore);
  let eventToPublish = new NDKEvent($ndk);
  try {
    if (!$ndk.signer) return false;
    eventToPublish.kind = NDKKind.Text;
    eventToPublish.content = content;
    eventToPublish.tags.push(["t", "nostree"]);
    await eventToPublish.publish();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
// TODO
export async function filterDbEvents(filter: NDKFilter): Promise<NDKEvent[] | undefined> {
  if (!browser) return;
  console.log("filterDbEvents", filter);
  const $ndk = getStore(ndkStore);
  let filterDb: NDKEvent[] | undefined;
  try {
    if (filter.kinds && filter.authors && filter["#l"]) {
      console.log("filter.kinds && filter.authors && filter['#l']", filter.kinds);
      const events = await db.events
        .where("pubkey")
        .anyOf(filter.authors!)
        .and((event) => filter.kinds!.includes(event.kind))
        .toArray();

      filterDb = events.map((event) => new NDKEvent($ndk, JSON.parse(event.event)));
    } else if (filter.kinds && filter.authors && filter["#d"]) {
      const events = await db.events
        .where("id")
        .startsWith(`${filter.kinds[0]}:${filter.authors[0]}:${filter["#d"]}`)
        .toArray();

      filterDb = events.map((event) => new NDKEvent($ndk, JSON.parse(event.event)));
    } else if (filter.authors && filter.kinds) {
      console.log("filter.authors", filter.authors);
      const events = await db.events
        .where("pubkey")
        .anyOf(filter.authors)
        .and((event) => filter.kinds!.includes(event.kind))
        .toArray();

      filterDb = events.map((event) => new NDKEvent($ndk, JSON.parse(event.event)));
    } else if (filter.authors) {
      const events = await db.events.where("pubkey").anyOf(filter.authors).toArray();

      filterDb = events.map((event) => new NDKEvent($ndk, JSON.parse(event.event)));
    } else if (filter.kinds) {
      const events = await db.events.where("kind").anyOf(filter.kinds).toArray();

      filterDb = events.map((event) => new NDKEvent($ndk, JSON.parse(event.event)));
    }
  } catch (error) {
    console.log(error);
  }

  return filterDb;
}
