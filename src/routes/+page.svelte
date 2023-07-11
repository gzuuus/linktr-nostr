<script lang="ts">
    import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { goto } from '$app/navigation';
    import { Button } from "agnostic-svelte";
    import LinktrLogo from '$lib/elements/icons/LinktrLogo.svelte';

    let user: NDKUser;

    async function login() {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
        signer.user().then(async (ndkUser) => {
            console.log(ndkUser);
            goto(`/${ndkUser.npub}`);
        });
    }
</script>
<div class="homeContainer">
    <div class="logoContainer">
        <LinktrLogo/>
    </div>
    <div class="p16">
        <h1>Linktr</h1>
        <p>Nostr based application for link lists </p>
    </div>
    <Button on:click={login} mode="primary" isBlock isRounded>Login</Button>
    <Button mode="secondary" isBlock isRounded><a href="https://pinstr.app" target="_blank" rel="noreferrer">Create list (pinstr.app)</a></Button>
</div>

<style>
    .homeContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 20px;
    }
    .logoContainer {
        display: flex;
        border: 1px solid var(--agnostic-focus-ring-color);
        padding: 25px 20px;
        border-radius: 100px;
    }
</style>