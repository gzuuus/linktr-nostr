<script lang="ts">
    import SearchComponent from "$lib/components/search-component.svelte";
    import { page } from "$app/stores";
    import SearchBar from "$lib/components/search-bar.svelte";
    let searchKind: string;

</script>
<svelte:head>
  <title>Nostree - Search</title>
  <meta name="description" content="Search profiles" />
  <meta property="og:title" content="Nostree - Search"/>
  <meta property="og:description" content="Search profiles" />
</svelte:head>
{#if searchKind == "profile"}
<h1>Profile search</h1>
<p>
  You can try to find profiles by name, handle, nostr address (nip05) or keywords in their biography.
</p>
{:else if searchKind == "hashtag"}
<h1>Hashtag search</h1>
<p>
  You can discover lists by hashtag
</p>
{/if}
<div>
  <SearchBar bind:searchKind={searchKind} isAdvancedSearch={true} />
</div>
  {#if $page.params.searcharr}
    <h2>Searching: {$page.params.searcharr}</h2>
    <SearchComponent searchQuery={$page.params.searcharr} />
  {/if}