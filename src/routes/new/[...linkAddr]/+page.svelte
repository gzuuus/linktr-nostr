<script lang="ts">
    import { NDKEvent} from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import CreateNewList from '$lib/components/create-new-list.svelte';
    import { ndkUser } from '$lib/stores/user';
    import { Button } from 'agnostic-svelte';
    import { Kind, nip19} from "nostr-tools";
    import { findListTags, findOtherTags, getTagValue, sortEventList } from '$lib/utils/helpers';
    import EditIcon from '$lib/elements/icons/edit-icon.svelte';
    import { Disclose } from "agnostic-svelte";
    import BinIcon from '$lib/elements/icons/bin-icon.svelte';
    import { Spinner } from "agnostic-svelte";
    import PinIcon from '$lib/elements/icons/pin-icon.svelte';
    import Login from '$lib/components/login.svelte';
    import { kindLinks } from '$lib/utils/constants';
    import { generateNanoId } from '$lib/utils/helpers';
    import RepublishIcon from '$lib/elements/icons/republish-icon.svelte';
    import InfoDialog from '$lib/components/info-dialog.svelte';

    let events: NDKEvent[] = [];
    let oldEvents: NDKEvent[] = [];
    let eventToEdit: any;
    let showSpinner = false;
    let fetchedOldEvents = false
    let fetchedMigratedEvents = false

    $: {
        if ($ndkUser) {
            showEvents();
        }
    }

    function showEvents() {
        if ($ndkUser) {
            let userPubDecoded: string = nip19.decode($ndkUser.npub).data.toString();
            $ndk.fetchEvents({ kinds: [30303 as Kind], authors: [userPubDecoded]}).then((fetchedEvent) => {
                oldEvents = Array.from(fetchedEvent).filter(event => getTagValue(event.tags, 'title') !== '');
                fetchedOldEvents = true
                sortEventList(events);
            })
            $ndk.fetchEvents({ kinds: [kindLinks], authors: [userPubDecoded], '#l': ['nostree']}).then((fetchedEvent) => {
                events = Array.from(fetchedEvent);
                fetchedMigratedEvents = true
                sortEventList(events);
            })
        }
    }

    function pickEventToEdit(event: NDKEvent) {
        eventToEdit = event;
    }

    function handleSubmit(eventToPublish: NDKEvent, toDelete:boolean = false) {
        const ndkEvent = new NDKEvent($ndk);
        ndkEvent.kind = kindLinks;
        let title = getTagValue(eventToPublish.tags, "title")
        ndkEvent.tags = [['title', title], ['d', getTagValue(eventToPublish.tags, "d")]];
        let links
        let labels
        if (toDelete){
            ndkEvent.kind = eventToPublish.kind;
            title = ''
            ndkEvent.tags = [['d', getTagValue(eventToPublish.tags, "d")]];
        }
        if (!toDelete){
             links = findListTags(eventToPublish.tags).map(tag => ({ link: tag.url, description: tag.text }));
             for (const linkData of links) {
                 const { link, description } = linkData;
                 ndkEvent.tags.push(['r', link, description]);
             }
             labels = findOtherTags(eventToPublish.tags, 'l').map(tag => ({ label: tag }));
             if (labels.length === 0 ){
                ndkEvent.tags.push(['l', 'nostree'], ['l', generateNanoId($ndkUser?.npub)]);
             } else if (labels.length === 1 && getTagValue(eventToPublish.tags, 'l') === 'nostree') {
                ndkEvent.tags.push(['l', generateNanoId($ndkUser?.npub)]);
             } else {
                for (const labelData of labels) {
                const { label } = labelData;
                ndkEvent.tags.push(['l', label]);
             }
             }

        }
        ndkEvent.publish().then(() => {
            events = [];
            oldEvents = [];
            fetchedOldEvents = false;
            fetchedMigratedEvents = false;
            showSpinner = false;
            setTimeout(() => {
                showEvents()
            }, 1100);
        }).catch((error) => {
            console.log("Error:", error);
            showSpinner = false;
        });
        }
        function checkBetwList(event: NDKEvent): boolean {
            let eventDtag = getTagValue(event.tags, "d");
            for (const oldEvent of events) {
                const oldEventDtag = getTagValue(oldEvent.tags, "d");
                if (eventDtag === oldEventDtag && oldEvent.kind != event.kind) {
                    return true;
                }
            }
            return false;
        }
</script>
{#if showSpinner}
<div class="spinnerContainer">
<Spinner size="xlarge"/>
</div>
{/if}
<div class="listContainer commonContainerStyle">
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
        <Login mode="primary" doGoto={false}/>
        {/if}
        {#key events.length}
        {#if events.length > 0}
        <div class="allListsContainer">
            {#key fetchedMigratedEvents}
            <Disclose isBackground title="All lists">
            {#each events as event, i}
                <div class="eventContainer">
                    <button class="iconButton" on:click={() => pickEventToEdit(event)}><EditIcon size={20}/></button>
                    <button class="iconButton" class:firstEvent={i == 0} on:click={() => {handleSubmit(event); showSpinner = true;}}><PinIcon size={20}/></button>
                    <button class="iconButton" on:click={() => { handleSubmit(event, true); showSpinner = true; }}><BinIcon size={20}/></button>
                    <h3>{getTagValue(event.tags, "title")}</h3>
                    {#each findListTags(event.tags) as { url, text }}
                        <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
                    {/each}
                </div>
            {/each}
            </Disclose>
            {/key}
        </div>
        {/if}
        {#if oldEvents.length > 0}
        <div class="allListsContainer">
            {#key fetchedOldEvents}
            {#each oldEvents as event, i}
                    {#if fetchedMigratedEvents && fetchedOldEvents}
                    {#if !checkBetwList(event)}
                    <hr/>
                    <div class="alertContainer">
                        <h3>🔺 List in the old format <span class="inline-span"><InfoDialog whatInfo="list-old-format-migrate"/></span></h3>
                        <div class="eventContainer">
                            <button class="iconButton"  on:click={() => {handleSubmit(event); showSpinner = true;}}><RepublishIcon size={20}/></button>
                            <button class="iconButton"  on:click={() => { handleSubmit(event, true); showSpinner = true; }}><BinIcon size={20}/></button>
                            <h3>{getTagValue(event.tags, "title")}</h3>
                            {#each findListTags(event.tags) as { url, text }}
                                <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
                            {/each}
                        </div>
                    </div>
                    <!-- {:else}
                     <h3>{getTagValue(event.tags, "title")}</h3>
                     <p>Already published</p> -->
                    {/if}
                    {/if}
                
            {/each}
            {/key}
        </div>
        {/if}
        {/key}
    </div>
</div>

<style>
    button:hover {
        color: var(--hover-color);
    }
    .firstEvent {
        color: var(--hover-color);
    }
    .listContainer {
        display: block;
        word-break: break-word;
    }

    .allListsContainer {
        margin-top: 0.5em;
    }
    .alertContainer {
        opacity: 0.6;
        transition: all 0.2s ease-in-out;
    }
    .alertContainer:hover{
        opacity: 1;
    }

</style>