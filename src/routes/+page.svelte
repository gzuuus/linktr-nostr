<script lang="ts">
    import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { goto } from '$app/navigation';
    import { Button } from "agnostic-svelte";
    import Logo from '$lib/elements/icons/logo.svelte';
    import { ndkUser } from '$lib/stores/user';

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
    <div>
        <h1>Nostree</h1>
        <p>Nostr based application to manage link lists, and show notes, and other stuff</p>
    </div>
    {#if !$ndkUser}
    <Button on:click={login} mode="primary" isBlock isRounded>Login</Button>
    {:else}
    <Button on:click={() =>goto('/new')} mode="primary" isBlock isRounded>Manage lists</Button>
    {/if}
</div>

<style>
    .homeContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        word-break: break-word;
    }
    .logoContainer {
        display: flex;
        border: 1px solid var(--agnostic-focus-ring-color);
        padding: 25px 20px;
        border-radius: 100px;
    }
</style>