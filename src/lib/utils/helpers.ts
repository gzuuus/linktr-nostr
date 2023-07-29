import { nip19 } from 'nostr-tools';
import type { NDKTag } from '@nostr-dev-kit/ndk';

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

export function findListTags(tags: NDKTag[]) {
  const matchingTags = tags.filter(tag => tag[0] === 'r');
  return matchingTags.map(tag => {
    const [url, text] = tag.slice(1);
    return { url, text };
  });
  };
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

export async function shareContent() {
  try {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        url: url,
      });
    } else {
      alert('Your browser does not support the sharing function. You can copy the link and share it manually.');
    }
  } catch (err) {
    console.error('Error', err);
  }
}
