<script lang="ts">
  export let searchQuery:string
  import ndk from "$lib/stores/provider";
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import PlaceHolderLoading from "./placeHolderLoading.svelte";

  let eventList: NDKEvent[] = [];
  let ndkFilter: NDKFilter
  
  $: {
    ndkFilter = { kinds: [0], search: searchQuery}
  }

  async function searchEvents(filter: NDKFilter) {
  eventList = [];

  await $ndk
    .fetchEvents(ndkFilter, {
      closeOnEose: true,
      groupable: true,
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
    })
    .then((fetchedEvent) => {
      eventList = Array.from(fetchedEvent).filter((event) => {
        const contentString = JSON.stringify(event.content).toLowerCase();
        return contentString.includes(searchQuery.toLowerCase().trim());
      });
    });
}

</script>
{#await searchEvents(ndkFilter)}
<div class="m-auto w-fit">
  <PlaceHolderLoading layoutKind={"avatar"} />
</div>
{:then value } 
<div>
  {#if eventList.length == 0}
  <h2>No matching profiles</h2>
  {:else}
  <div class="flex flex-col gap-4">
  {#each eventList as event}
    <div class="common-container-content">
      <ProfileCardCompact userPub={event.author.npub} />
    </div>
    <hr/>
  {/each}
  </div>
  {/if}
</div>
{/await}