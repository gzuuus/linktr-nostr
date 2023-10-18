<script lang="ts">
  import { goto } from "$app/navigation";
  import Logo from "$lib/elements/icons/logo.svelte";
  import { ndkUser } from "$lib/stores/user";
  import LnIcon from "$lib/elements/icons/ln-icon.svelte";
  import HeartIcon from "$lib/elements/icons/heart-icon.svelte";
  import Login from "$lib/components/login.svelte";
    import { ogImageUrl } from "$lib/utils/constants";
    import GhIcon from "$lib/elements/icons/gh-icon.svelte";
</script>
<svelte:head>
<title>Nostree</title>
<meta
  name="description"
  content="A Nostr-based application to create, manage and discover link lists, show notes and other stuff."
/>

<meta property="og:title" content="Nostree" />
<meta
  property="og:description"
  content="A Nostr-based application to create, manage and discover link lists, show notes and other stuff."
/>
<meta property="og:image" content={ogImageUrl} />
</svelte:head>
<div class="common-container common-ring">
  <div class="common-container-content">
    <div class="mx-auto w-fit common-ring p-5 rounded-full">
      <Logo size={100} />
    </div>
    <div>
      <h1>Nostree</h1>
      <p>A Nostr-based application to create, manage and discover link lists, and other stuff.</p>
    </div>
    {#if !$ndkUser}
      <Login  />
    {:else}
      <button class="btn variant-filled" on:click={() => goto(`/${$ndkUser?.npub}`)}>Profile</button>
      <button class="btn variant-filled" on:click={() => goto("/new")}>Manage lists</button>
    {/if}
    <button class="btn variant-filled" on:click={() => goto("/search")}>Search</button>
    <button class="btn variant-filled" on:click={() => goto("/explore")}>Explore</button>
    <button class="btn variant-filled" on:click={() => goto("/docs")}>Docs</button>
  <div>
    <a href="lightning:gzuuus@getalby.com"
      ><button class="common-btn-icon-ghost"><LnIcon size={16} /></button></a
    >
    <button class="common-btn-icon-ghost"
      on:click={() => goto("/npub1gzuushllat7pet0ccv9yuhygvc8ldeyhrgxuwg744dn5khnpk3gs3ea5ds")}
      ><HeartIcon size={16} /></button
    >
    <a href="https://github.com/gzuuus/linkr-nostr" target="_blank" rel="noopener noreferrer"
    ><button class="common-btn-icon-ghost"><GhIcon size={16} /></button></a
    >
    </div>
</div>
</div>

<!-- <style>
  .homeContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    word-break: break-word;
    background: var(--background-color);
    border-radius: var(--agnostic-radius);
    padding: 15px;
  }
  .logoContainer {
    display: flex;
    border: 1px solid var(--agnostic-focus-ring-color);
    padding: 25px 20px;
    border-radius: 100px;
  }
  button {
    display: inline-flex;
    padding: 0.2em;
    margin: 0.2em;
  }
  .homeParentContainer {
    background: var(--accent-color);
    padding: 0;
    border-radius: calc(var(--agnostic-radius) + 2px);
  }
</style> -->
