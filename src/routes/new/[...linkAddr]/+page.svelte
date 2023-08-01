<script lang="ts">
    import type { PageData } from './$types';
    import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import type { NDKEvent, NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { onMount } from 'svelte';
    import CreateNewList from '$lib/components/create-new-list.svelte';
    import { ndkUser } from '$lib/stores/user';
    import { Button } from 'agnostic-svelte';
    import { Kind, nip19, type Event } from "nostr-tools";
    import { findListTags, getTagValue } from '$lib/utils/helpers';
    import PlusSmall from "$lib/elements/icons/plus-small.svelte";

    // export let data: PageData;
    let events: NDKEvent[] = [];
    const linkListEventKind = 30303 as Kind;
    onMount(() => {
        if (!$ndkUser) {
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
            console.log(ndkCurrentUser);
            let userPubDecoded: string = nip19.decode(ndkCurrentUser.npub).data.toString();
            console.log(userPubDecoded);
            $ndk.fetchEvents({ kinds: [linkListEventKind], authors: [userPubDecoded]}).then((fetchedEvent) => {
                events = Array.from(fetchedEvent); 
                console.log(events);
            });
        });
    }

</script>

<div class="homeContainer">
    <div class="p16">
        {#if $ndkUser}
        <CreateNewList eventToEdit={undefined}/>
        {:else}
        <Button on:click={login} mode="primary" isBlock isRounded>Login</Button>
        {/if}
        {#if events}
            {#each events as event}
            <div class="eventContainer">
                <h3>{getTagValue(event.tags, "title")}</h3>
                {#each findListTags(event.tags) as { url, text }}
                    <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
                {/each}
                <div class="eventContainerButtons">
                </div>
            </div>
            {/each}
        {/if}
    </div>
</div>
