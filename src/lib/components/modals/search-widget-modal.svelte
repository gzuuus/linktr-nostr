<script lang="ts">
  import { getModalStore } from '@skeletonlabs/skeleton';
  import SearchBar from "../search-bar.svelte";
  export let parent: any | undefined;

  let isSearchDone: boolean = false;
  let searchKind: string;
  const modalStore = getModalStore();

  $:{
    if (isSearchDone) {
      parent.onClose();
    }
  }
</script>

{#if $modalStore[0] || parent==undefined}
<div class="card p-4 w-modal shadow-xl space-y-4 flex flex-col items-center text-center">
  <header class="text-2xl font-bold">Search {searchKind}</header>
  <p class:hidden={searchKind != "profile"}>
    You can try to find profiles by name, handle, nostr address (nip05) or keywords in their biography.
  </p>
  <p class:hidden={searchKind != "hashtag"}>
    You can discover lists by hashtag
  </p>

  <SearchBar bind:searchDone={isSearchDone} bind:searchKind={searchKind} isAdvancedSearch={true} />
</div>
{/if}
