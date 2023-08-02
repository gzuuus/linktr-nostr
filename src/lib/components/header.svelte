<script lang="ts">
    import Logo from '$lib/elements/icons/logo.svelte';
    import ProfileIcon from '$lib/elements/icons/profile-icon.svelte';
    import LogoutIcon from '$lib/elements/icons/logout-icon.svelte';
    import { Button } from 'agnostic-svelte';
    import { ndkUser } from '$lib/stores/user';
    import { goto } from '$app/navigation';
    import { logout } from '$lib/utils/helpers';

    function handleGotoProfile() {
        goto(`/${$ndkUser?.npub}`);
    }
    function handleGotoNewList(){
        goto('/new');
    }
</script>
  <div class="container">
          <div class="headerLogo"><a href="/"><Logo size={50}/></a></div>
    {#if $ndkUser}
    <div class="userMenu">
        <Button on:click={handleGotoNewList} mode="primary" isLink>Manage lists</Button>
        <Button on:click={handleGotoProfile} mode="primary" isCircle isLink><ProfileIcon size={20} /></Button>
        <Button on:click={logout} mode="primary" isCircle isLink><LogoutIcon size={20} /></Button>
    </div>
    {/if}
  </div>

<style>
    .container {
        position: fixed;
        width: 100%;
    }
    .userMenu{
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 1em;
        display: flex;
        gap: 0.5em;
    }
    .headerLogo{
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 1em;
    }
</style>