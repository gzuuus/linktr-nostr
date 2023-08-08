<script lang="ts">
    import { NDKNip07Signer, NDKRelay, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { goto } from '$app/navigation';
    import { Button } from "agnostic-svelte";
    import Logo from '$lib/elements/icons/logo.svelte';
    import { ndkUser } from '$lib/stores/user';
    import { findListTags } from '$lib/utils/helpers';
    import { NDKRelaySet} from '@nostr-dev-kit/ndk';
    let userRelayList: string[] = [];

    async function login() {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
        signer.user().then(async (ndkCurrentUser) => {
            let user = $ndk.getUser({
                npub: ndkCurrentUser.npub,
                relayUrls: userRelayList
            });
            user.relayList().then((relays) => {
                relays.forEach((relay) => {
                const tags = relay.tags.map(tag => tag);
                    findListTags(tags).forEach(element => {
                    userRelayList.push(element.url);
                });
                });
            }).then(() => {
                ndkUser.set(user);
                goto(`/${$ndkUser?.npub}`);
            });
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