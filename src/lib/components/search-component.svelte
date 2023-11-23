<script lang="ts">
  export let searchQuery:string
  import ndk from "$lib/stores/provider";
  import { NDKRelaySet, type NDKEvent, type NDKFilter, NDKRelay } from "@nostr-dev-kit/ndk";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import PlaceHolderLoading from "./placeHolderLoading.svelte";
  import { sortEventList } from "$lib/utils/helpers";
  import { onDestroy } from "svelte";

  let eventList: NDKEvent[] = [];
  let ndkFilter: NDKFilter = { kinds: [0], search: searchQuery, limit: 50}
  let isSubscribed: boolean = false;
  const searchRelays: NDKRelaySet = new NDKRelaySet(new Set(), $ndk);
  searchRelays.addRelay(new NDKRelay("wss://relay.nostr.band"));
  searchRelays.addRelay(new NDKRelay("wss://search.nos.today"));
  searchRelays.addRelay(new NDKRelay("wss://nos.lol"));

  $: {
    ndkFilter = { kinds: [0], search: searchQuery, limit: 50}
  }

const sub = $ndk.subscribe(ndkFilter, {
    closeOnEose: true,
    groupable: false,
  }, searchRelays)
async function searchEvents() {
  eventList = [];
  isSubscribed = true;
  sub.on("event", (event) => {
    const contentString = JSON.stringify(event.content).toLowerCase();
    
    if (contentString.includes(searchQuery.toLowerCase().trim())) {
      eventList = [...eventList, event];
      sortEventList(eventList);
    }
  });
  sub.on("eose", () => {
    isSubscribed = false;
  });
}
onDestroy(() => {
  sub.stop();
  isSubscribed = false;
});
</script>
{#await searchEvents()}
<div class="m-auto w-fit">
  <PlaceHolderLoading layoutKind={"avatar"} />
</div>
{:then value } 
<div>
  {#if eventList.length == 0 && isSubscribed == false}
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