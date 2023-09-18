<script lang="ts">
    import SearchComponent from "$lib/components/search-component.svelte";
  
    let searchQuery = "";
    let currentSearchQuery = "";
    function submitQuery(){
        currentSearchQuery = searchQuery 
    }
    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            submitQuery();
        }
    }
  </script>
  <h1>Search</h1>
  <div>
    <input type="text" bind:value={searchQuery} placeholder="What are you looking for?..." on:keypress={handleKeyPress} />
    <button on:click={submitQuery}>Search</button>
  </div>
  {#if currentSearchQuery}
  <SearchComponent searchQuery={currentSearchQuery} />
  {/if}