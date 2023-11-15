<script lang="ts">
    import { goto } from "$app/navigation";
    import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
    import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
    import { RadioGroup, RadioItem, focusTrap } from "@skeletonlabs/skeleton";
    import { debounce } from "debounce";
    export let searchDone: boolean = false;
    export let searchQuery: string = "";
    export let searchKind: string = "profile";
    export let isAdvancedSearch: boolean = false;
    function submitQuery() {
    if (searchQuery.trim() !== "") {
      searchQuery = searchQuery.toLowerCase().trim();
        if (searchKind == "hashtag") {
            goto(`/explore/${searchQuery}`);
        } else{
            goto(`/search/${searchQuery}`);
        }
    }
    searchDone = true
  }
  </script>
  <div class="input-group input-group-divider grid-cols-[1fr_auto]">
    <form 
      use:focusTrap={true}
      on:submit|preventDefault={debounce(submitQuery, 200)}
      >
        <input class="input" type="search" bind:value={searchQuery} placeholder="Search..." />
    </form>
    <button type="submit" class="variant-filled-secondary" on:click={debounce(submitQuery, 200)}>Search</button>
  </div>
  {#if isAdvancedSearch}
  <RadioGroup>
    <RadioItem bind:group={searchKind} name="justify" value="profile"><ProfileIcon size={18} /></RadioItem>
    <RadioItem bind:group={searchKind} name="justify" value="hashtag"><HashtagIconcopy size={18} /></RadioItem>
  </RadioGroup>
  {/if}