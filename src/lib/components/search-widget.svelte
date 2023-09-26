<script lang="ts">
  export let searchHashtag:boolean=false;
  export let isSearchBar:boolean=false;
  export let buttonText:string | undefined = "";
  import SearchIcon from "$lib/elements/icons/search-icon.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
    import CloseIcon from "$lib/elements/icons/close-icon.svelte";

  let showInputField: boolean=false;
  if (isSearchBar){
    showInputField = true;
  }

  let searchQuery = "";
  function submitQuery(){
    if (searchHashtag){
      goto(`${$page.url.origin}/explore/${searchQuery}`);
    } else {
      goto(`${$page.url.origin}/search/${searchQuery}`);
    }
  }
  function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter") {
          submitQuery();
          showInputField = false;
          searchQuery="";
      }
  }

</script>
<button class="secondary-button" class:inline-span={searchHashtag} class:hidden={showInputField} on:click={() => showInputField = !showInputField}>{buttonText}<SearchIcon size={22}/></button>
<div class="inline-span" class:hidden={!showInputField} style="gap: 0.3em;">
  <input class="searchInput" type="text" bind:value={searchQuery} placeholder="What are you looking for?..." on:keypress={handleKeyPress} />
  <button class="secondary-button" on:click={submitQuery}><SearchIcon size={22}/></button>
  <button class:hidden={isSearchBar} class="secondary-button" on:click={() => showInputField = !showInputField}><CloseIcon size={22}/></button>
</div>