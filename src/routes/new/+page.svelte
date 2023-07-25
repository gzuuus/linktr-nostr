<script lang="ts">

    import { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import type { NDKUser } from '@nostr-dev-kit/ndk';
    import { unixTimeNow } from '$lib/utils/helpers';
    import ndkStore from '$lib/stores/provider';
    import { get } from 'svelte/store';
    import ndk from '$lib/stores/provider';
    import { Button } from "agnostic-svelte";
    import { onMount } from 'svelte';
    
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
        signer.user().then( console.log );
    }
    // console.log($ndk)
    function publish() {
        const ndkEvent = new NDKEvent($ndk);
        ndkEvent.kind = 1;
        ndkEvent.content = "Hello, brave new world!";
        ndkEvent.tags = [['title','value'],['r','https://example.com', 'example.com']];
        ndkEvent.publish();
    }
</script>

<div class="homeContainer">
    <div class="logoContainer">

    </div>
    <div class="p16">
        <h1>Linktr</h1>
        <p>Nostr based application to show link lists, notes, and other stuff </p>
            <Button on:click={publish} mode="primary" isBlock isRounded>publish</Button>

    </div>
</div>
