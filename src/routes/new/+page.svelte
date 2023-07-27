<script lang="ts">
    import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import type { NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { onMount } from 'svelte';
    import CreateNewList from '$lib/components/create-new-list.svelte';
    import { ndkUser } from '$lib/stores/user';
    onMount(() => {
        if (!$ndk.signer) {
            login();
        }
    })
    let user: NDKUser;
    async function login() {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
        signer.user().then(async (ndkCurrentUser) => {
            ndkUser.set(ndkCurrentUser);
        });
    }
</script>

<div class="homeContainer">
    <div class="p16">
        <CreateNewList/>
    </div>
</div>
