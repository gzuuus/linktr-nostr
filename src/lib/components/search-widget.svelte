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

<button class="common-btn-sm-ghost gap-1" class:inline-span={searchHashtag} class:hidden={showInputField} on:click={() => showInputField = !showInputField}>{buttonText}<SearchIcon size={20}/></button>
<div class=" inline-flex gap-1" class:hidden={!showInputField}>
  <input class=" variant-form-material p-1" type="text" bind:value={searchQuery} placeholder="What are you looking for?..." on:keypress={handleKeyPress} />
  <button class="common-btn-sm-ghost" on:click={submitQuery}><SearchIcon size={22}/></button>
  <button class:hidden={isSearchBar} class="common-btn-sm-ghost" on:click={() => showInputField = !showInputField}><CloseIcon size={22}/></button>
</div>