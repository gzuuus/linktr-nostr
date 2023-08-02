<script lang="ts">
    import type { PageData } from './$types';
    import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
    import { NDKEvent, type NDKUser } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { onMount } from 'svelte';
    import CreateNewList from '$lib/components/create-new-list.svelte';
    import { ndkUser } from '$lib/stores/user';
    import { Button } from 'agnostic-svelte';
    import { Kind, nip19, type Event } from "nostr-tools";
    import { findListTags, getTagValue } from '$lib/utils/helpers';
    import EditIcon from '$lib/elements/icons/edit-icon.svelte';
    import RepublishIcon from '$lib/elements/icons/republish-icon.svelte';
    import { Disclose } from "agnostic-svelte";

    // export let data: PageData;
    let events: NDKEvent[] = [];
    const linkListEventKind = 30303 as Kind;
    let eventToEdit: any;
    onMount(() => {
        if (!$ndkUser) {
            login();
        } else {
            showEvents();
        }
    })

    function showEvents() {
        if ($ndkUser) {
            let userPubDecoded: string = nip19.decode($ndkUser.npub).data.toString();
            $ndk.fetchEvents({ kinds: [linkListEventKind], authors: [userPubDecoded]}).then((fetchedEvent) => {
                events = Array.from(fetchedEvent); 
            });  
        }
    }
    let user: NDKUser;
    async function login() {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
        signer.user().then(async (ndkCurrentUser) => {
            ndkUser.set(ndkCurrentUser);
            showEvents();
        });
    }

    function pickEventToEdit(event: NDKEvent) {
        eventToEdit = event;
    }

    function handleSubmit(eventToPublish: NDKEvent) {
        const ndkEvent = new NDKEvent($ndk);
        ndkEvent.kind = 30303;
        let title = getTagValue(eventToPublish.tags, "title")
        const rTags = findListTags(eventToPublish.tags);
        const links = rTags.map(tag => ({ link: tag.url, description: tag.text }));
        ndkEvent.tags = [['title', title], ['d', getTagValue(eventToPublish.tags, "d")]];
        for (const linkData of links) {
            const { link, description } = linkData;
            ndkEvent.tags.push(['r', link, description]);
        }
        ndkEvent.publish();
    }

</script>

<div class="listContainer">
    <div>
        {#if $ndkUser}
        {#key eventToEdit}
            {#if !eventToEdit}
            <CreateNewList eventToEdit={undefined}/>
            {:else}
            <CreateNewList eventToEdit={eventToEdit}/>
            {/if}
        {/key}
        {:else}
        <Button on:click={login} mode="primary" isBlock isRounded>Login</Button>
        {/if}

        {#if events.length > 0}
        <div class="allListsContainer">
            <Disclose isBackground title="All lists">
            {#each events as event}
                <div class="eventContainer">
                    <button on:click={() => pickEventToEdit(event)}><EditIcon size={20}/></button>
                    <button on:click={() => handleSubmit(event)}><RepublishIcon size={20}/></button>
                    <h3>{getTagValue(event.tags, "title")}</h3>
                    {#each findListTags(event.tags) as { url, text }}
                        <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
                    {/each}
                    <div class="eventContainerButtons">
                    </div>
                </div>
            {/each}
            </Disclose>
        </div>
        {/if}
        
    </div>
</div>

<style>
    button {
        display: inline-flex;
        line-height: normal;
        background: var(--hover-b-color);
        color: var(--accent-color);
        padding: 0.4em;
    }
    button:hover {
        color: var(--hover-color);
    }
    .listContainer {
	display: flex;
	justify-content: center;
    }
    .allListsContainer {
	width: 257px;
    }

</style>