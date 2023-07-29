<script lang="ts">
    import 'agnostic-svelte/css/common.min.css';
    import Logo from '$lib/elements/icons/logo.svelte';
    import ProfileIcon from '$lib/elements/icons/profile-icon.svelte';
    import { Button } from 'agnostic-svelte';
    import { ndkUser } from '$lib/stores/user';
    import { goto } from '$app/navigation';

    function handleGotoProfile() {
        goto(`/${$ndkUser?.npub}`);
    }
    function handleGotoNewList(){
        goto('/new');
    }
</script>
  <div class="container">
          <div><a href="/"><Logo size={50}/></a></div>
    <!-- {#if $ndkUser}
    <div class="userMenu">
        <Button on:click={handleGotoNewList} mode="primary" isLink>Create list</Button>
        <Button on:click={handleGotoProfile} mode="primary" isCircle isLink><ProfileIcon size={20} /></Button>
    </div>
    {/if} -->
  </div>

<style>
    .container {
        position: fixed;
        width: 100%;
    }
</style>