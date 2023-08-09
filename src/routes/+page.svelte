<script lang="ts">
    import { NDKNip07Signer, NDKRelay, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { goto } from '$app/navigation';
    import { Button } from "agnostic-svelte";
    import Logo from '$lib/elements/icons/logo.svelte';
    import { ndkUser } from '$lib/stores/user';
    import { findListTags } from '$lib/utils/helpers';
    import { NDKRelaySet} from '@nostr-dev-kit/ndk';
    import LnIcon from '$lib/elements/icons/ln-icon.svelte';
    import HeartIcon from '$lib/elements/icons/heart-icon.svelte';
    let userRelayList: string[] = [];

    async function login() {
    try {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);

        const ndkCurrentUser = await signer.user();
        const user = $ndk.getUser({
            npub: ndkCurrentUser.npub,
        });
        ndkUser.set(user);
        goto(`/${$ndkUser?.npub}`);
    } catch (error) {
        console.error('Error on login:', error);
    }
}
</script>
<div class="homeParentContainer commonContainerStyle">
    <div class="homeContainer ">
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
        <Button on:click={() =>goto(`/${$ndkUser?.npub}`)} mode="primary" isBlock isRounded>Profile</Button>
        <Button on:click={() =>goto('/new')} mode="primary" isBlock isRounded>Manage lists</Button>
        {/if}
        <Button on:click={() =>goto('/explore')} mode="primary" isBlock isRounded>Explore</Button>
    </div>
    <h3>From gzuuus with <a href="lightning:gzuuus@getalby.com"><button class="switchButtons"><LnIcon size={18} /></button></a> and 
        <button on:click={() => goto('/npub1gzuushllat7pet0ccv9yuhygvc8ldeyhrgxuwg744dn5khnpk3gs3ea5ds')} class="switchButtons"><HeartIcon size={18} /></button>
    </h3>
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