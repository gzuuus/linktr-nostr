<script lang="ts">
	import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
    import UserMenu from './user-menu.svelte';
    import CloseIcon from '$lib/elements/icons/close-icon.svelte';

	const drawerStore = getDrawerStore();

	$: classesDrawer = $drawerStore.id === 'side-nav' ? 'lg:hidden' : '';
</script>

<Drawer class="{classesDrawer}">
	<div class="flex flex-col h-full">
		<section class="flex justify-end p-2">
			<button class="common-btn-icon-ghost" on:click={() => drawerStore.close()}>
		<CloseIcon size={18} />
		</button>
		</section>
		{#if $drawerStore.id === 'side-nav'}
			<div class="grid h-full py-2 px-2">
				<UserMenu />
			</div>
		{/if}
	</div>
</Drawer>