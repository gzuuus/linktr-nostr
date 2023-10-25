<script lang="ts">
  import Logo from "$lib/elements/icons/logo.svelte";
  import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
  import LogoutIcon from "$lib/elements/icons/logout-icon.svelte";
  import { ndkUser } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  import { logout } from "$lib/utils/helpers";
  import Login from "./login.svelte";
  import SearchIcon from "$lib/elements/icons/search-icon.svelte";
  import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
  import { popup } from '@skeletonlabs/skeleton';
  import ThemeButton from "./theme-button.svelte";
  import ThemesIcon from "$lib/elements/icons/themes-icon.svelte";
</script>

<div class="sm:absolute w-full inline-flex items-center px-4 py-2 justify-between">
  <div class="headerLogo"><a href="/"><Logo size={40} /></a></div>
  <div class="flex gap-2 items-center">
    <button class="common-btn-icon-ghost" on:click={() => goto('/search')}><SearchIcon size={20}/></button>
    <button class="common-btn-icon-ghost" on:click={() => goto('/explore')}><ExploreIcon size={20}/></button>
    <button class="common-btn-icon-ghost" use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}>
      <ThemesIcon size={20} />
    </button>
    <div class="card p-4 w-60 shadow-xl" data-popup="theme">
      <ThemeButton />
    </div>
    {#if $ndkUser}
      <button class="common-btn-icon-ghost" on:click={() => goto(`/${$ndkUser?.npub}`)}><ProfileIcon size={20} /></button>
      <button class="common-btn-sm-ghost" on:click={() => goto("/new")}>Manage lists</button>
      <button class="common-btn-icon-ghost" on:click={logout}><LogoutIcon size={20} /></button>
      {:else}
      <Login mode={"primary-sm"}/>
    {/if}
  </div>

</div>
