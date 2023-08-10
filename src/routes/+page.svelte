<script lang="ts">
    import { goto } from '$app/navigation';
    import { Button } from "agnostic-svelte";
    import Logo from '$lib/elements/icons/logo.svelte';
    import { ndkUser } from '$lib/stores/user';
    import LnIcon from '$lib/elements/icons/ln-icon.svelte';
    import HeartIcon from '$lib/elements/icons/heart-icon.svelte';
    import Login from '$lib/components/login.svelte';

</script>
<div class="homeParentContainer commonContainerStyle">
    <div class="homeContainer ">
        <div class="logoContainer">
            <Logo size={100}/>
        </div>
        <div>
            <h1>Nostree</h1>
            <p>A Nostr-based application to create, manage and discover link lists, show notes and other stuff.</p>
        </div>
        {#if !$ndkUser}
        <Login mode="primary"/>
        {:else}
        <Button on:click={() =>goto(`/${$ndkUser?.npub}`)} mode="primary" isBlock isRounded>Profile</Button>
        <Button on:click={() =>goto('/new')} mode="primary" isBlock isRounded>Manage lists</Button>
        {/if}
        <Button on:click={() =>goto('/explore')} mode="primary" isBlock isRounded>Explore</Button>
    </div>
    <p>From gzuuus with <a href="lightning:gzuuus@getalby.com"><button class="switchButtons"><LnIcon size={16} /></button></a> and 
        <button on:click={() => goto('/npub1gzuushllat7pet0ccv9yuhygvc8ldeyhrgxuwg744dn5khnpk3gs3ea5ds')} class="switchButtons"><HeartIcon size={16} /></button>
    </p>
    </div>
<style>
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

    }
</style>