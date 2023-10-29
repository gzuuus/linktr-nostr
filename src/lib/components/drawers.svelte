<script lang="ts">
	import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
    import UserMenu from './user-menu.svelte';
    import CloseIcon from '$lib/elements/icons/close-icon.svelte';

	const drawerStore = getDrawerStore();

	$: classesDrawer = $drawerStore.id === 'side-nav' ? 'lg:hidden' : '';
</script>

<Drawer class="{classesDrawer}">
	<section class="absolute top-2 right-2">
		<button class="common-btn-icon-ghost" on:click={() => drawerStore.close()}>
	<CloseIcon size={18} />
	</button>
	</section>
		{#if $drawerStore.id === 'side-nav'}
 	<div class="grid h-full p-4">
		<UserMenu />
    </div>
	{/if}
</Drawer>