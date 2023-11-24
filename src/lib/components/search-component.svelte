<script lang="ts">
  export let searchQuery: string;
  import ndk from "$lib/stores/provider";
  import { NDKRelaySet, type NDKEvent, type NDKFilter, NDKRelay } from "@nostr-dev-kit/ndk";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import { onDestroy } from "svelte";
  import type { ExtendedBaseType, NDKEventStore } from "@nostr-dev-kit/ndk-svelte";

  let searchResults: NDKEventStore<ExtendedBaseType<NDKEvent>> | undefined;
  let eventList: NDKEvent[] = [];
  let isSubscribed: boolean = false;
  const searchRelays: NDKRelaySet = new NDKRelaySet(new Set(), $ndk);
  searchRelays.addRelay(new NDKRelay("wss://relay.nostr.band"));
  searchRelays.addRelay(new NDKRelay("wss://search.nos.today"));
  searchRelays.addRelay(new NDKRelay("wss://nos.lol"));

  async function searchEvents() {
    try {
      const ndkFilter: NDKFilter = { kinds: [0], search: searchQuery, limit: 50 };
      searchResults = $ndk.storeSubscribe(ndkFilter, {closeOnEose: true, relaySet: searchRelays });
      eventList = [];
      isSubscribed = true;

      if (searchResults) {
        searchResults.onEose(() => {
          isSubscribed = false;
        });
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  }

  $: if (searchQuery) {
    searchEvents();
  }

  $: {
    if ($searchResults) {
      eventList = $searchResults
        .filter(event =>
          JSON.stringify(event.content)
            .toLocaleLowerCase()
            .includes(searchQuery.toLowerCase().trim())
        );
    }
  }

  onDestroy(() => {
    if (searchResults) searchResults.unsubscribe();
    isSubscribed = false;
  });
</script>
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