<script lang="ts">
    export let searchHashtag:boolean=false;
    export let isSearchBar:boolean=false;
    export let buttonText:string | undefined = "";
    import SearchIcon from "$lib/elements/icons/search-icon.svelte";
    import { goto } from "$app/navigation";
    import { focusTrap } from "@skeletonlabs/skeleton";
  
    let searchQuery = "";
    function submitQuery() {
    if (searchQuery.trim() !== "") {
        if (searchHashtag) {
            goto(`/explore/${searchQuery}`);
        } else{
            goto(`/search/${searchQuery}`);
        }
    }
  }
  
  </script>
    <button class="common-btn-sm-ghost" class:hidden={isSearchBar} on:click={() => isSearchBar = !isSearchBar}>
        <span>{buttonText}</span>
        <span><SearchIcon size={18}/></span>
    </button>
  <div class=" inline-flex gap-1" class:hidden={!isSearchBar} >
    <form
    class="border border-surface-500 p-6 space-y-4 rounded-container-token"
    on:submit|preventDefault={submitQuery}
    use:focusTrap={true}
  >
    <input class="input" type="text" bind:value={searchQuery} placeholder="What are you looking for?..." />
    <button type="submit" class="common-btn-sm-filled">Search</button>
  </form>
  </div>