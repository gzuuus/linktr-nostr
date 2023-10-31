<script lang="ts">
    import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
    import CloseIcon from "$lib/elements/icons/close-icon.svelte";
    import CreateNewList from "./create-new-list.svelte";
    import { Autocomplete, type AutocompleteOption } from '@skeletonlabs/skeleton';

    $: selectedTemplate= ""
    export let showCreateNewList = false;

    $:{
        showCreateNewList = selectedTemplate ? true : false;
    }
    let showOptions: boolean = false;
    let customTemplate: string;

const templateOptions: AutocompleteOption<string>[] = [
	{ label: 'Films', value: 'films'},
    { label: 'Music', value: 'music'},
	{ label: 'Books', value: 'books'},
	{ label: 'Nostr', value: 'nostr'},
];

function onFlavorSelection(event: CustomEvent<AutocompleteOption<string>>): void {
	selectedTemplate = event.detail.label;
}
function resetFields(): void {
    selectedTemplate = "";
    customTemplate = "";
    showOptions = false;
    showCreateNewList = false;
}		
</script>

{#if selectedTemplate}
<div>
<button class="common-btn-icon-ghost w-fit" on:click={resetFields}>
    <CloseIcon size={20} />
</button>
</div>
{/if}

<div class:hidden={selectedTemplate} class="btn-group variant-filled grid grid-cols-[1fr_auto] w-full">
    <button on:click={() => selectedTemplate = "blank"} type="button">Create new list</button>
    <button on:click={() => showOptions = !showOptions} type="button">
        <ChevronIconVertical flipVertical={!showOptions} size={18} />
    </button>
</div>

{#if selectedTemplate }
<CreateNewList listTemplate={selectedTemplate} />
{/if}
<div class:hidden={selectedTemplate || !showOptions} class="flex flex-col gap-2" >
    <span>Create new list from a template</span>
    <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
        <Autocomplete bind:input={selectedTemplate} options={templateOptions} on:selection={onFlavorSelection} />
    </div>
    <form on:submit|preventDefault={() => selectedTemplate = customTemplate}>
        <div class="input-group input-group-divider grid-cols-[1fr_auto]">
            <input type="search" placeholder="Custom subject" bind:value={customTemplate} >
            <button type="submit" on:click={() => selectedTemplate = customTemplate} class="variant-soft">Create</button>
        </div>
    </form>
</div>