<script lang="ts">
    import SearchComponent from "$lib/components/search-component.svelte";
    import { page } from "$app/stores";
  
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
    if ($page.params.searcharr){
        currentSearchQuery = $page.params.searcharr
    }
  </script>
  <svelte:head>
    <title>Nostree - Search</title>
    <meta name="description" content="Search profiles" />
    <meta property="og:title" content="Nostree - Search"/>
    <meta property="og:description" content="Search profiles" />
  </svelte:head>
  <div class="commonContainerStyle">
  <h1>Profile search</h1>
  <p>You can try to find profiles by the name, handle, nostr address (nip05) or keywords</p>
  <div>
    <input class="searchInput" type="text" bind:value={searchQuery} placeholder="What are you looking for?..." on:keypress={handleKeyPress} />
    <button on:click={submitQuery}>Search</button>
  </div>
  {#key $page.params.searcharr}
  {#if currentSearchQuery}
  <h2>Searching: {currentSearchQuery}</h2>
  <SearchComponent searchQuery={currentSearchQuery} />
  {/if}
  {/key}
  </div>