<script lang="ts">
    import Logo from '$lib/elements/icons/logo.svelte';
    import ProfileIcon from '$lib/elements/icons/profile-icon.svelte';
    import LogoutIcon from '$lib/elements/icons/logout-icon.svelte';
    import { ndkUser } from '$lib/stores/user';
    import { goto } from '$app/navigation';
    import { logout } from '$lib/utils/helpers';
    import Login from './login.svelte';

    function handleGotoProfile() {
        goto(`/${$ndkUser?.npub}`);
    }
    function handleGotoNewList(){
        goto('/new');
    }
</script>
  <div class="headerContainer">
          <div class="headerLogo"><a href="/"><Logo size={50}/></a></div>
    {#if $ndkUser}
    <div class="userMenu">
        <button class="secondary-button" on:click={handleGotoNewList}>Manage lists</button>
        <button class="secondary-button" on:click={handleGotoProfile}><ProfileIcon size={20} /></button>
        <button class="secondary-button" on:click={logout}><LogoutIcon size={20} /></button>
    </div>
    {:else}
    <div class="userMenu">
        <Login mode="secondary"/>
    </div>
    {/if}
  </div>

<style>
    .headerContainer{
        position: absolute;
        width: 100%;
    }
    .userMenu{
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 1em;
        display: flex;
        gap: 0.5em;
        line-height: 0;
    }
    .headerLogo{
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 1em;
    }
</style>