<script lang="ts">
    import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { currentUser } from '$lib/stores/currentUser';
    import { goto } from '$app/navigation';

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
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={login}>Login</button>
