<script lang="ts">
    import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { goto } from '$app/navigation';
    import { Button } from "agnostic-svelte";
    import Logo from '$lib/elements/icons/logo.svelte';
    import { ndkUser } from '$lib/stores/user';
    import { writable } from 'svelte/store';

    async function login() {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
        signer.user().then(async (ndkCurrentUser) => {
            ndkUser.set(ndkCurrentUser);
            goto(`/${ndkCurrentUser.npub}`);
        });
    }
</script>
<div class="homeContainer">
    <div class="logoContainer">
        <Logo size={100}/>
    </div>
    <div class="p16">
        <h1>Nostree</h1>
        <p>Nostr based application to show link lists, notes, and other stuff </p>
    </div>
    {#if !$ndkUser}
    <Button on:click={login} mode="primary" isBlock isRounded>Login</Button>
    {/if}
    <Button on:click={() =>goto('/new')} mode="primary" isBlock isRounded>Manage lists</Button>
</div>

<style>
    .homeContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .logoContainer {
        display: flex;
        border: 1px solid var(--agnostic-focus-ring-color);
        padding: 25px 20px;
        border-radius: 100px;
    }
</style>