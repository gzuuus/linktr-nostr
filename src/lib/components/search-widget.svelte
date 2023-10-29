<script lang="ts">
  import { goto } from "$app/navigation";
  import { getModalStore } from '@skeletonlabs/skeleton';
  export let parent: any;

  const modalStore = getModalStore();
  let searchQuery = "";

  function submitQuery() {
    if (searchQuery.trim() !== "") {
      goto(`/search/${searchQuery}`);
    }
    parent.onClose();
  }
</script>

{#if $modalStore[0]}
<div class="card p-4 w-modal shadow-xl space-y-4">
  <header class="text-2xl font-bold">Search</header>
  <form
    class="border border-surface-500 p-6 space-y-4 rounded-container-token"
    on:submit|preventDefault={submitQuery}
  >
    <span>You can try to find profiles by name, handle, nostr address (nip05) or keywords in their biography.</span>
    <input class="input" type="text" bind:value={searchQuery} placeholder="What are you looking for?..." />
    <button type="submit" class="btn {parent.buttonPositive}">Search</button>
    <button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
  </form>
</div>
{/if}
