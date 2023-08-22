<script lang="ts">
    export let whatInfo: string | undefined = '';    
    import DocListSlug from "$lib/docsComponents/doc-list-slug.svelte";
    import DocNewList from "$lib/docsComponents/doc-new-list.svelte";
    import BinIcon from "$lib/elements/icons/bin-icon.svelte";
    import EditIcon from "$lib/elements/icons/edit-icon.svelte";
    import InfoIcon from "$lib/elements/icons/info-icon.svelte";
    import PinIcon from "$lib/elements/icons/pin-icon.svelte";
    import PlusSmall from "$lib/elements/icons/plus-small.svelte";
    import ResetIcon from "$lib/elements/icons/reset-icon.svelte";

    let isModalVisible:boolean = false;
</script>
<h3><button type="button" class="inputWithIcon switchButtons noBorder noPadding" on:click={() => isModalVisible = !isModalVisible}><InfoIcon size={18}/></button></h3>

{#if isModalVisible}

        <div class="modal">
        <div class="modal-content">
            {#if whatInfo == "list-slug"}
            <DocListSlug/>
            {:else if whatInfo == "new-list"}
            <DocNewList/>
            {/if}
        <div class="closeModal">
            <button type="button" on:click={() => isModalVisible = false}>👍</button>
        </div>
        </div>
        </div>
{/if}

<style>
</style>