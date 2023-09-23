<script lang="ts">
  import SearchIcon from "$lib/elements/icons/search-icon.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
    import CloseIcon from "$lib/elements/icons/close-icon.svelte";

  let showInputField: boolean=false;

  let searchQuery = "";
  function submitQuery(){
      goto(`${$page.url.origin}/search/${searchQuery}`);
  }
  function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter") {
          submitQuery();
          showInputField = false;
          searchQuery="";
      }
  }

</script>
<button class="secondary-button" class:hidden={showInputField} on:click={() => showInputField = !showInputField}><SearchIcon size={22}/></button>
<div class="inline-span" class:hidden={!showInputField} style="gap: 0.3em;">
  <input class="searchInput" type="text" bind:value={searchQuery} placeholder="What are you looking for?..." on:keypress={handleKeyPress} />
  <button class="secondary-button" on:click={submitQuery}><SearchIcon size={22}/></button>
  <button class="secondary-button" on:click={() => showInputField = !showInputField}><CloseIcon size={22}/></button>
</div>