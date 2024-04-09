<script lang="ts">
    import type { Link } from "$lib/classes/list";
    import MinusSmall from "$lib/elements/icons/minus-small.svelte";
    import { outNostrLinksUrl } from "$lib/utils/constants";
    import { findListTags } from "$lib/utils/helpers";
    import type { NDKTag } from "@nostr-dev-kit/ndk";

    export let eventTags: NDKTag[];
    $: linkTags = findListTags(eventTags)
    let showAll = false;
    let visibleItems = 5;
    let filteredTags: Link[]
    $:{
        filteredTags = showAll ? linkTags : linkTags.slice(0, visibleItems);
    } 

    function toggleShowAll() {
        showAll = !showAll;
    }
</script>

{#each filteredTags as { url, description }}
    <a
        href={url.startsWith("nostr:") ? `${outNostrLinksUrl}/${url.split(":")[1]}` : url}
        target="_blank"
        rel="noreferrer"
    >
        <button class="btn variant-filled w-full whitespace-pre-wrap">{description}</button>
    </a>
{/each}

{#if linkTags.length > visibleItems}
    <button on:click={toggleShowAll} class="btn btn-icon btn-icon-sm variant-soft m-auto">
        {#if showAll}
            <MinusSmall size={16} />        
            {:else}
            <small>+{linkTags.length - visibleItems}</small>
        {/if}
    </button>
{/if}
