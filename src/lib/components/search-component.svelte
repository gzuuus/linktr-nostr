<script lang="ts">
  export let searchQuery:string
  import ndk from "$lib/stores/provider";
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import Logo from "$lib/elements/icons/logo.svelte";

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
<div class="commonContainerStyle">
  <div class="loading-global"><Logo size={50}/></div>
  <h3>Loading...</h3>
</div>
{:then value } 
<div>
  {#if eventList.length == 0}
  <h2>No matching profiles</h2>
  {:else}
  {#each eventList as event}
    <div class="eventContainer">
      <ProfileCardCompact userPub={event.author.npub} />
    </div>
  {/each}
  {/if}
</div>
{/await}