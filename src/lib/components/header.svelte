<script lang="ts">
  import Logo from "$lib/elements/icons/logo.svelte";
  import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
  import LogoutIcon from "$lib/elements/icons/logout-icon.svelte";
  import { ndkUser } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  import { logout } from "$lib/utils/helpers";
  import Login from "./login.svelte";
  import SearchIcon from "$lib/elements/icons/search-icon.svelte";
  import SearchWidget from "./search-widget.svelte";
</script>

<div class="headerContainer">
  <div class="headerLogo"><a href="/"><Logo size={40} /></a></div>
  
  {#if $ndkUser}
    <div class="userMenu">
      <button type="button" class="secondary-button" on:click={() => goto('/search')}><SearchIcon size={20}/></button>
      <button class="secondary-button" on:click={() => goto("/new")}>Manage lists</button>
      <button class="secondary-button" on:click={() => goto(`/${$ndkUser?.npub}`)}><ProfileIcon size={20} /></button>
      <button class="secondary-button" on:click={logout}><LogoutIcon size={20} /></button>
    </div>
  {:else}
    <div class="userMenu">
      <SearchWidget/>
      <Login mode="secondary" />
    </div>
  {/if}
</div>

<style>
  .headerContainer {
    position: absolute;
    width: 100%;
  }
  .userMenu {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 1em;
    display: flex;
    gap: 0.5em;
    line-height: 0;
  }
  .headerLogo {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5em;
  }
</style>
