<script lang="ts">
    import PlaceHolderLoading from "$lib/components/placeHolderLoading.svelte";
    import DocsThemer from "$lib/components/themer-components/DocsThemer.svelte";
    import ndk from "$lib/stores/provider";
    import { ndkUser } from '$lib/stores/user';
    import { kindCSSAsset } from "$lib/utils/constants";
    import { NDKSubscriptionCacheUsage, type NDKFilter, type NDKKind, type NDKUserProfile, NDKEvent } from "@nostr-dev-kit/ndk";

    let eventList: NDKEvent[] = [];
    let linkListLength: number;

    async function fetchCssAsset() {
    let ndkFilter: NDKFilter = {authors: [$ndkUser!.hexpubkey()], kinds: [kindCSSAsset as NDKKind], "#L": ["nostree-theme"]}
    await $ndk
      .fetchEvents(ndkFilter, {
        closeOnEose: true,
        groupable: true,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      })
      .then((fetchedEvent) => {
        console.log(fetchedEvent);
        eventList = Array.from(fetchedEvent);
        linkListLength = eventList.length;
      });
  }
</script>
{#if $ndkUser}
{#await fetchCssAsset()}
<PlaceHolderLoading colCount={6} />
{:then value} 
    {#if eventList.length > 0}
        {#each eventList as event}
            {event.tagValue('l')}
        {/each}
    {/if}
{/await}
{/if}
{#if typeof document != "undefined"}
<DocsThemer />
{/if}