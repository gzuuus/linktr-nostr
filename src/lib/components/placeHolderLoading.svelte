<script lang="ts">
    import Logo from "$lib/elements/icons/logo.svelte";

    export let layoutKind: string = "list";
    export let listItemPadding: string = "py-5";
    export let colCount: number = 2;
    export let logoSize: number = 75;
    let logoContainerWidth: string = "w-32";

    if (logoSize > 70) {
        logoContainerWidth = "w-24";
    } else if (logoSize > 50) {
        logoContainerWidth = "w-20";
    } else {
        logoContainerWidth = "w-16";
    }

</script>
{#if layoutKind == "avatar"}
<div class={`placeholder-circle animate-pulse ${logoContainerWidth} flex`}>
    <div class="loading-global w-fit m-auto">
        <Logo size={logoSize}/>
    </div>
</div>
{:else}
<section class="w-full">
    <div class="grid grid-cols-1 gap-2">
      {#each Array(colCount) as _, index}
        <div class={`placeholder ${listItemPadding} animate-pulse`} />
      {/each}
    </div>
</section>
{/if}

<style>
    .loading-global {
        animation: spin 4s linear infinite;
    }
</style>