import { Kind, nip19 } from 'nostr-tools';
import { NDKUser, type NDKEvent, type NDKTag } from '@nostr-dev-kit/ndk';
import { ndkUser } from '$lib/stores/user';
import { lengthStore } from "$lib/stores/eventListsLengths";
import { goto } from '$app/navigation';
import type { LinkData } from "$lib/classes/list";
import { nanoid } from 'nanoid';
import { isNip05Valid as isNip05ValidStore } from '$lib/stores/user';

export function unixTimeNow() {
    return Math.floor(new Date().getTime() / 1000);
}

export function dateTomorrow() {
    return new Date(Date.now() + 3600 * 1000 * 24);
}

export function isNip05(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}
export async function isNip05Valid(input: string | undefined = ''): Promise<boolean> {
  try {
    let nip05promise = await NDKUser.fromNip05(input);

    if (nip05promise === undefined) {
      isNip05ValidStore.set({isNip05Valid: false, Nip05address: undefined });
      console.log('isNip05Valid: nip05 is undefined');
      return false;
    }
    isNip05ValidStore.set({isNip05Valid: true, Nip05address: input });
    console.log('isNip05Valid: true');
    return true;
  } catch (error) {
    isNip05ValidStore.set({isNip05Valid: false, Nip05address: undefined });
    return false;
  }
}



  export function unixToDate(unixTimestamp: number | undefined) {
    if (unixTimestamp === undefined) { return ''; }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(unixTimestamp * 1000).toLocaleString('en-US', options);
  }
  
  export function buildEventPointer(id: string | undefined = '', relays: string[] | undefined=[], author: string, kind?: number, identifier:string | undefined = '') {
    let objPointer: any;
    let encodedPointer: string ="";
    if (kind === 1) {
      objPointer = {
        id: id,
        relays: relays,
        author: author
      };
      return encodedPointer = nip19.neventEncode(objPointer);
    } else if (kind === 30023 || kind === 30001) {
      console.log('buildEventPointer: 30023 || 30001');
      objPointer = {
        identifier: identifier,
        pubkey: author,
        kind: kind,
        relays: relays
      };
      return encodedPointer = nip19.naddrEncode(objPointer);
    }

    // return encodedPointer;
  }
  
  export function decodeEventPointer(encodedPointer: string) {
    const objPointer = nip19.decode(encodedPointer);
    return objPointer
  }
  export function getTagValue(tags:NDKTag[], key:string) {
    const titleTag = tags.find(tag => tag[0] === key);
    return titleTag ? titleTag[1] : '';
  }

  export function findListTags(tags: NDKTag[]) {
    const matchingTags = tags.filter(tag => tag[0] === 'r');
  
    return matchingTags.map(tag => {
        const [url, text] = tag.slice(1);
        return { url, text } as { url: string; text: string };
    });
  }
  export function findOtherTags(tags: NDKTag[], tagName: string) {
    const matchingTags = tags.filter(tag => tag[0] === tagName);
  
    return matchingTags.map(tag => {
      const [tagValue] = tag.slice(1);
      return tagValue as string;
    });
  }
  
  
export function parseNostrUrls(rawContent: string): string {
  const nostrPattern = /nostr:(nprofile|nevent|naddr|npub1)(\w+)/g;
  
  return rawContent.replace(nostrPattern, (match, type, id) => {
    let nostrEntity = type + id;
    let nostrEntityUrl = `https://nostr.com/${nostrEntity}`;
    
    switch (type) {
      case 'nprofile':
        return `${nostrEntityUrl}`;
      case 'nevent':
      case 'naddr':
        return `${nostrEntityUrl}`;
      default:
        return match;
    }
  });
}

  export function truncateString(str?: string): string {
    if (str === undefined) { return '';} 
    else {return str.substring(0, 12) + '...' + str.substring(str.length - 6);}
  }

  export function truncatedBech(bech32: string, length?: number): string {
    return `${bech32.substring(0, length || 9)}...`;
}

export async function copyToClipboard(textToCopy: string){
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

export async function sharePage(urlToShare: string) {
  if (navigator && typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
    let url = urlToShare;
    try {
      await navigator.share({
        url,
      });
    } catch (error) {
      console.error('Error :', error);
    }
  } else {
    console.warn('no share');
  }
}

export function logout() {
  ndkUser.set(null);
  lengthStore.set({});
  goto('/');
}

export function sortEventList(eventList: NDKEvent[]) {
  eventList.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
}

export function generateNanoId(seed:string | undefined = unixTimeNow().toString()){
  const userID = seed.slice(-2); 
  const id = nanoid(8);
  return userID + id;
}