import { type NDKUserProfile, NDKUser, type NDKTag} from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/provider';
import type { ProfilePointer } from 'nostr-tools/lib/nip19';
import { NDKNip07Signer} from '@nostr-dev-kit/ndk';
const ndk = getStore(ndkStore);

export async function nip05toPub (params:string) {
    let nip05PubValue = await NDKUser.fromNip05(params);
    return nip05PubValue?.npub
}

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

  export function unixToDate(unixTimestamp: number | undefined) {
    if (unixTimestamp === undefined) { return ''; }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(unixTimestamp * 1000).toLocaleString('en-US', options);
  }
  
  export function buildEventPointer(id: string, relays?: string[], author?: string, kind?: number, tags:NDKTag[] = []) {
    let objPointer: any;
    let encodedPointer: string ="";
    if (kind === 1) {
      objPointer = {
        id: id,
        relays: relays,
        author: author
      };
      encodedPointer = nip19.neventEncode(objPointer);
    } else if (kind === 30023) {
      objPointer = {
        identifier: getTagValue(tags, 'd'),
        pubkey: author,
        kind: kind,
        relays: relays
      };
      encodedPointer = nip19.naddrEncode(objPointer);
    }

    return encodedPointer;
  }
  
  export function getTagValue(tags:NDKTag[], key:string) {
    const titleTag = tags.find(tag => tag[0] === key);
    return titleTag ? titleTag[1] : null;
  }

export function parseNostrUrls(rawContent: string): string {
    const nostrPattern = /nostr:(nprofile|nevent|naddr)(\w+)/g;
    return rawContent.replace(nostrPattern, (match, type, id) => {
      let nostrEntity = type+id
      let decodedNostrEntity = nip19.decode(type+id);
      switch (type) {
        case 'nprofile':
          return `<a href="https://nostr.com/${nostrEntity}"> hello </a>`;
        case 'nevent':
          return `<a href="https://nostr.com/${nostrEntity}" target="_blank" rel="noopener noreferrer">Perfil ${nostrEntity.slice(0,16)}</a>`;
        case 'naddr':
          return `<a href="https://nostr.com/${nostrEntity}" target="_blank" rel="noopener noreferrer">Perfil ${nostrEntity.slice(0,16)}</a>`;
 
        default:
          return match;
      }
    });
  }
