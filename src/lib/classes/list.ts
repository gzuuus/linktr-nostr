import type NDKEvent from '@nostr-dev-kit/ndk';
import type { NDKTag } from '@nostr-dev-kit/ndk';

interface ListParams {
    event?: string; // The parsed event as NDKEvent
    eventId?: string; // The raw nostr event ID
    id?: string; // either kind:author tuple for replaceable or NIP-33 kind:author:d-tag for PRE
    nip19?: string; // NIP-19 nevent or naddr encoded id
    authorPubkey: string; // Hex pubkey of the author
    name: string; // The d-tag name, if exists
    content: string;
    createdAt?: number;
    kind: number;
    expanded: boolean; // Expanded or collapsed for display
    publicItems: NDKTag[]; // The public items in the list, in tag format
}

export interface DeleteListParams {
    listId?: string;
}

export interface CreateListParams {
    event: NDKEvent;
}

/**
 * List is a formatted and extended version of an NDKEvent for
 * known kinds of lists. You can see the list of supported events in the
 * isKnownListKind method below.
 */

export default class List {
    static supportedKinds = [
        30303
    ];

    event?: string; // The parsed event as NDKEvent
    eventId?: string; // The raw nostr event ID
    id?: string; // either kind:author tuple for replaceable or NIP-33 kind:author:d-tag for PRE
    nip19?: string; // NIP-19 nevent or naddr encoded id
    authorPubkey: string; // Hex pubkey of the author
    name: string; // The d-tag name, if exists
    content: string;
    createdAt?: number;
    kind: number;
    expanded: boolean; // Expanded or collapsed for display
    publicItems: NDKTag[]; // The public items in the list, in tag format

    constructor(listParams: ListParams) {
        this.event = listParams.event;
        this.eventId = listParams.eventId;
        this.id = listParams.id;
        this.nip19 = listParams.nip19;
        this.authorPubkey = listParams.authorPubkey;
        this.name = listParams.name;
        this.content = listParams.content;
        this.createdAt = listParams.createdAt;
        this.kind = listParams.kind;
        this.expanded = listParams.expanded;
        this.publicItems = listParams.publicItems;
    }
}