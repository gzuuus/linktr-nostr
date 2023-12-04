<script lang="ts">
    import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
    import CloseIcon from "$lib/elements/icons/close-icon.svelte";
    import CreateNewList from "./create-new-list.svelte";
    import { Autocomplete, type AutocompleteOption } from '@skeletonlabs/skeleton';
    import { fetchUserEvents, validateURL, validateURLTitle } from "$lib/utils/helpers";
    import { ndkUser } from "$lib/stores/user";
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { onDestroy } from "svelte";
    import TextIcon from "$lib/elements/icons/text-icon.svelte";
    import LinkIcon from "$lib/elements/icons/link-icon.svelte";
    import { getModalStore } from "@skeletonlabs/skeleton";
    export let showCreateNewList = false;

    const modalStore = getModalStore();
    let selectedTemplate:string;
    let fetchedEvents: NDKEvent[] = [];
    let eventToEdit: NDKEvent | undefined = undefined;
    let isTitleValid: boolean = false;
    let isURLValid: boolean = false;
    let submitAddLink: boolean = false;
    let isFormSent: boolean = false;
    let showOptions: boolean = false;
    let customTemplate: string;
    let addLink = {url: '', text: '' }

    $:{
        showCreateNewList = selectedTemplate ? true : false;
    }

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
        fetchedEvents = await fetchUserEvents($ndkUser?.pubkey!);
    }

    $: if (submitAddLink && !isFormSent){
        modalStore.clear();
        modalStore.trigger({ type: 'component', component: 'modalLoading'});
    }

    onDestroy(() => {
        fetchedEvents = [];
        eventToEdit = undefined;
    });
</script>
<div class="card p-4 flex flex-col items-center">
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
        bind:value={addLink.text}
        on:input={() => isTitleValid = validateURLTitle(addLink.text)}
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
        <span>Select list to add</span>
        <select class="select w-full" bind:value={eventToEdit}>
            {#each fetchedEvents as event}
            <option value={event}>{event.tagValue('title')}</option>
            {/each}
        </select>
    </label>

    <button disabled={!isURLValid || !isTitleValid || !eventToEdit}  class="common-btn-filled w-full" on:click={() => submitAddLink = true} type="button">Add link</button>
    {#if submitAddLink}
        <div class="hidden">
            <CreateNewList bind:isFormSent eventToEdit={eventToEdit} addLink={addLink} autoPublish={true} doGoto={false} />
        </div>
    {/if}
</div>
{/if}
<div class:hidden={selectedTemplate || fetchedEvents.length > 0} class="flex flex-col gap-2">
    <button class="common-btn-filled w-full" on:click={fetchEvents} type="button">Add a new link to a list</button>

    <div class="btn-group variant-filled grid grid-cols-[1fr_auto] w-full">
        <button on:click={() => selectedTemplate = "blank"} type="button">Create new list</button>
        <button on:click={() => showOptions = !showOptions} type="button">
            <ChevronIconVertical flipVertical={!showOptions} size={18} />
        </button>
    </div>
</div>

<div class:hidden={ !showOptions } class="flex flex-col gap-2 pt-2" >
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