<script lang="ts">
  import { goto } from "$app/navigation";
  import Logo from "$lib/elements/icons/logo.svelte";
  import { ndkUser } from "$lib/stores/user";
  import LnIcon from "$lib/elements/icons/ln-icon.svelte";
  import HeartIcon from "$lib/elements/icons/heart-icon.svelte";
  import Login from "$lib/components/login.svelte";
  import { ogImageUrl } from "$lib/utils/constants";
  import GhIcon from "$lib/elements/icons/gh-icon.svelte";
  import { browser } from "$app/environment";
  
  let isOsMac = false;
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}
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
      <Login mode="primary" />
    {:else}
      <button class="btn variant-filled" on:click={() => goto(`/${$ndkUser?.npub}`)}>Profile</button>
      <button class="btn variant-filled" on:click={() => goto("/new")}>Manage lists</button>
    {/if}
    <button class="btn variant-filled" on:click={() => goto("/search")}>
      <span>Search</span>
      <small class="hidden sm2:inline-block sm2:badge sm2:variant-glass opacity-50">{isOsMac ? '⌘' : 'Ctrl'}+K</small>
    </button>
    <button class="btn variant-filled" on:click={() => goto("/explore")}>Explore</button>
    <button class="btn variant-filled" on:click={() => goto("/docs")}>Docs</button>
    <button class="btn variant-filled" on:click={() => goto("/theming")}>Theming</button>
  <div>
    <a href="lightning:gzuuus@getalby.com"
      ><button class="common-btn-icon-ghost"><LnIcon size={16} /></button></a
    >
    <button class="common-btn-icon-ghost"
      on:click={() => goto("/npub1gzuushllat7pet0ccv9yuhygvc8ldeyhrgxuwg744dn5khnpk3gs3ea5ds")}
      ><HeartIcon size={16} /></button
    >
    <a href="https://github.com/gzuuus/linktr-nostr" target="_blank" rel="noopener noreferrer"
    ><button class="common-btn-icon-ghost"><GhIcon size={16} /></button></a
    >
    </div>
</div>
</div>