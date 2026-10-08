<script lang="ts">
  export let searchQuery: string;
  import nostrClient from "$lib/stores/provider";
  import { type NostrEvent, type NostrEventStore } from "$lib/nostr/client";
  import type { Filter } from "nostr-tools";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import { onDestroy } from "svelte";

  let searchResults: NostrEventStore | undefined;
  let eventList: NostrEvent[] = [];
  let isSubscribed: boolean = false;
  const searchRelays: string[] = [
    "wss://relay.nostr.band",
    "wss://search.nos.today",
    "wss://nos.lol",
  ];

  async function searchEvents() {
    try {
      const nostrFilter: Filter = { kinds: [0], search: searchQuery, limit: 50 };
      searchResults = $nostrClient.storeSubscribe(nostrFilter, { closeOnEose: true, relays: searchRelays });
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