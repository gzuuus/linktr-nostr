<script lang="ts">
	import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
    import UserMenu from './user-menu.svelte';
    import CloseIcon from '$lib/elements/icons/close-icon.svelte';

	const drawerStore = getDrawerStore();

	$: classesDrawer = $drawerStore.id === 'side-nav' ? 'lg:hidden' : '';
</script>

<Drawer class="{classesDrawer}">
	<div class="flex flex-col h-full overflow-hidden">
		{#if $drawerStore.id === 'side-nav'}
			<div class="grid h-full py-2 px-2">
				<UserMenu />
			</div>
		{/if}
	</div>
</Drawer>