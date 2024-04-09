<script lang="ts">
    import { goto } from "$app/navigation";
    import LoginMenu from "$lib/components/login-menu.svelte";
    import CloseIcon from "$lib/elements/icons/close-icon.svelte";
    export let parent: any;
</script>
<div class="card p-4 shadow-xl space-y-4">
    <header class="common-2xl-header text-end">
        <button class="common-btn-icon-filled" on:click={parent.onClose}><CloseIcon size={20} /></button>
    </header>

    <LoginMenu/>

    <footer class="{parent.regionFooter}">
    </footer>
</div>