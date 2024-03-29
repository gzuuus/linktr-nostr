<script lang="ts">
    import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
    import CloseIcon from "$lib/elements/icons/close-icon.svelte";
    import CreateNewList from "./create-new-list.svelte";
    import { Autocomplete, getToastStore, type AutocompleteOption } from '@skeletonlabs/skeleton';
    import { addLinkToList, fetchUserEvents, findSlugTag, publishKind1, validateURL, validateURLTitle } from "$lib/utils/helpers";
    import { ndkActiveUser } from "$lib/stores/provider";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { onDestroy } from "svelte";
    import TextIcon from "$lib/elements/icons/text-icon.svelte";
    import LinkIcon from "$lib/elements/icons/link-icon.svelte";
    import { getModalStore } from "@skeletonlabs/skeleton";
    import type { Link } from "$lib/classes/list";
    import { errorPublishToast, succesPublishToast } from "$lib/utils/constants";
    import { page } from "$app/stores";
    import { localStore } from "$lib/stores/stores";
    export let showCreateNewList = false;

    const modalStore = getModalStore();
    const toastStore = getToastStore();
    let selectedTemplate:string;
    let fetchedEvents: NDKEvent[] = [];
    let eventToEdit: NDKEvent
    let isTitleValid: boolean = false;
    let isURLValid: boolean = false;
    let shareLinkAdded:boolean = false
    let isFormSent: boolean = false;
    let showOptions: boolean = false;
    let customTemplate: string;
    let addLink: Link = {
        description: "",
        url: "",
    };

    const templateOptions: AutocompleteOption<string>[] = [
        { label: 'Films', value: 'films'},
        { label: 'Music', value: 'music'},
        { label: 'Books', value: 'books'},
        { label: 'Nostr', value: 'nostr'},
    ];

    function onSelection(event: CustomEvent<AutocompleteOption<string>>): void {
        selectedTemplate = event.detail.label;
    }

    function resetFields(): void {
        selectedTemplate = "";
        customTemplate = "";
        showOptions = false;
        showCreateNewList = false;
    }

    async function fetchEvents(): Promise<void> {
        fetchedEvents = await fetchUserEvents($ndkActiveUser?.pubkey!);
    }

    let shareContent = '';

    $: {
        if (shareLinkAdded){
            shareContent = generateShareContent();
        }
    }

    $:{
        showCreateNewList = selectedTemplate ? true : false;
    }

    function generateShareContent() {
    const baseText = "I just added a new link to my Nostree list";
    const eventTitle = eventToEdit ? eventToEdit.tagValue("title") : "";
    const linkDescription = addLink.description ? addLink.description : '<Link description>';
    const linkUrl = addLink.url ? addLink.url : '<Link url>';
    const origin = $page.url.origin;
    const userIdentifier = $localStore.UserIdentifier ? $localStore.UserIdentifier : $ndkActiveUser?.npub;
    const slug = eventToEdit ? findSlugTag(eventToEdit) : '';

    return `${baseText} ${eventTitle}! 🎉.\n${linkDescription}, ${linkUrl}\nCheck it out: ${origin}/${userIdentifier}/${slug}`;
    }

    async function handleAddLink() {
        modalStore.clear();
        modalStore.trigger({ type: 'component', component: 'modalLoading'});
        try{
            isFormSent = await addLinkToList(addLink, eventToEdit);
            if (isFormSent) {
                if (shareLinkAdded) {
                    let isPublished = await publishKind1(shareContent);
                    isPublished && toastStore.trigger(succesPublishToast) && modalStore.clear(); 
                    !isPublished && toastStore.trigger(errorPublishToast) && modalStore.clear();
                } else {
                    modalStore.clear(); 
                    toastStore.trigger(succesPublishToast);
                }
            } else {
                modalStore.clear();
                toastStore.trigger(errorPublishToast)
            }
        } catch (e) {
            modalStore.clear();
            toastStore.trigger(errorPublishToast)
            console.log("Error:", e);
        }
    }
    function toggleShareLink () {
        shareLinkAdded = !shareLinkAdded
    }
    onDestroy(() => {
        fetchedEvents = [];
    });
</script>

<div class="card p-4 flex flex-col items-center shadow-xl">
{#if selectedTemplate}
    <div class="text-end w-full">
        <button class="common-btn-icon-ghost" on:click={resetFields}>
            <CloseIcon size={20} />
        </button>
    </div>
    <CreateNewList listTemplate={selectedTemplate} />
{/if}
{#if fetchedEvents.length > 0}
<div class="flex flex-col gap-2">
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
        <div class="input-group-shim">
        <TextIcon size={18} />
        </div>
        <input
        type="text"
        id={`description`}
        placeholder="Link name"
        bind:value={addLink.description}
        on:input={() => isTitleValid = validateURLTitle(addLink.description)}
        />
    </div>
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
        <div class="input-group-shim cursor-pointer">
        <LinkIcon size={18} />
        </div>
        <input
        type="text"
        id={`link`}
        placeholder="URL: https://..."
        bind:value={addLink.url}
        on:input={() => isURLValid = validateURL(addLink.url)}
        />
    </div>

    <label class="label">
        <span>Select the list to add the link to</span>
        <select class="select w-full" bind:value={eventToEdit}>
            {#each fetchedEvents as event}
                <option value={event}>{event.tagValue('title')}</option>
            {/each}
        </select>
    </label>
    <button 
        disabled={!isURLValid || !isTitleValid || !eventToEdit}  
        class="common-btn-filled w-full" 
        on:click={handleAddLink}
        type="button">Add link
    </button>
    <label class="flex items-center space-x-2">
		<input 
            class="checkbox" 
            type="checkbox" 
            class:cursor-not-allowed={!isURLValid || !isTitleValid || !eventToEdit} 
            disabled={!isURLValid || !isTitleValid || !eventToEdit} 
            on:change={toggleShareLink}
        />
		<p>Share link as note</p>
	</label>
    {#if shareLinkAdded}
        <textarea class="textarea" rows="4" bind:value={shareContent} placeholder="Enter some text..." />
    {/if}
</div>
{/if}

<div class:hidden={selectedTemplate || fetchedEvents.length > 0} class="flex flex-col gap-2 w-full">
    <!-- TODO/BUG: If user doesnt have lists this doesnt works  -->
    <button class="common-btn-filled w-full" on:click={fetchEvents} type="button">Add a new link to a list</button>

    <div class="btn-group variant-filled grid grid-cols-[1fr_auto] w-full">
        <button on:click={() => selectedTemplate = "blank"} type="button">Create new list</button>
        <button on:click={() => showOptions = !showOptions} type="button">
            <ChevronIconVertical flipVertical={!showOptions} size={18} />
        </button>
    </div>
</div>

<div class:hidden={ !showOptions || selectedTemplate } class="flex flex-col gap-2 pt-2" >
    <span class="font-semibold">Create new list from a template</span>
    <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
        <Autocomplete bind:input={selectedTemplate} options={templateOptions} on:selection={onSelection} />
    </div>
    <form on:submit|preventDefault={() => selectedTemplate = customTemplate}>
        <div class="input-group input-group-divider grid-cols-[1fr_auto]">
            <input type="search" placeholder="Custom subject" bind:value={customTemplate} >
            <button type="submit" on:click={() => selectedTemplate = customTemplate} class="variant-soft">Create</button>
        </div>
    </form>
</div>
</div>