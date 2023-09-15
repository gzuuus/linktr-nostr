<script lang="ts">
    import { page } from '$app/stores';
    import ProfileCard from '$lib/components/profile-card.svelte';
    import EventCard from '$lib/components/event-card.svelte';
    import { kindLinks, kindArticles } from '$lib/utils/constants';
    import { nip19 } from 'nostr-tools';
    let naddrPointer: any;
    let decPubkey: string;
    let deceventKind: number;
    let decidentifier: string;
    $: {
        naddrPointer = nip19.decode($page.params.naddrlink);
        decPubkey = nip19.npubEncode(naddrPointer.data.pubkey);
        deceventKind = naddrPointer.data.kind;
        decidentifier = naddrPointer.data.identifier;
    }
</script>

<div class="commonContainerStyle">
    {#key naddrPointer}
        <ProfileCard userPub={decPubkey} />
        <div>
            {#if deceventKind == kindLinks}
                <EventCard userPub={decPubkey} eventKind={deceventKind} dValue={decidentifier} />
            {:else if deceventKind == kindArticles}
                <EventCard
                    userPub={decPubkey}
                    eventKind={deceventKind}
                    dValue={decidentifier}
                    showSummary={true}
                />
            {/if}
        </div>
        {#if deceventKind == kindArticles}
            <div>
                <hr />
                <h2>Other articles</h2>
                <EventCard userPub={decPubkey} eventKind={deceventKind} />
            </div>
        {/if}
    {/key}
</div>
