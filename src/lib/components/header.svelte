<script lang="ts">
	import Logo from "$lib/elements/icons/logo.svelte";
	import { goto } from "$app/navigation";
	import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
	import ThemeButton from "./theme-button.svelte";
	import ThemesIcon from "$lib/elements/icons/themes-icon.svelte";
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { AppBar, popup, getModalStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import HamburgerIcon from "$lib/elements/icons/hamburger-icon.svelte";
	import Login from "./login.svelte";
	import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
	import { logout } from "$lib/utils/helpers";
	import LogoutIcon from "$lib/elements/icons/logout-icon.svelte";
	import { ndkActiveUser } from "$lib/stores/provider";
	import EditIcon from "$lib/elements/icons/edit-icon.svelte";
	import SearchIcon from "$lib/elements/icons/search-icon.svelte";
    import { browser } from "$app/environment";
    import PlusSmall from "$lib/elements/icons/plus-small.svelte";
    import { localStore } from "$lib/stores/stores";
	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();

	let isOsMac = false;
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}

	function onWindowKeydown(e: KeyboardEvent): void {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			$modalStore.length ? modalStore.close() : modalStore.trigger({ type: 'component', component: 'modalSearch'});
		} else if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === 'r') {
			e.preventDefault();
			$modalStore.length ? modalStore.close() : modalStore.trigger({ type: 'component', component: 'modalRelayList'});
		}
	}

	function drawerOpen(): void {
		const s: DrawerSettings = { 
			id: 'side-nav',
			width: 'w-[280px] md:w-[480px]',
			padding: 'p-2',
			rounded: 'rounded-xl',
			position: 'right'
			};
		drawerStore.open(s);
	}
</script>
<svelte:window on:keydown|stopPropagation={onWindowKeydown} />
<AppBar background="sm:backdrop-blur" border="sm:border-b border-opacity-20 border-surface-500" regionRowMain="" slotTrail="!space-x-2">
<svelte:fragment slot="lead">
	<div class="flex items-center space-x-4">
		<a class="lg:!ml-0 w-fit lg:w-auto overflow-hidden" href="/" title="Go to Homepage">
			<Logo size={36} />
		</a>
	</div>
</svelte:fragment>
<svelte:fragment slot="trail">
	<div class="hidden gap-2 sm:inline-flex">
		<button class="common-btn-sm-ghost" on:click={() => goto('/explore')}>
			<span><ExploreIcon size={18} /></span>
			<span class="hidden sm2:inline-flex">Explore</span>
		</button>
		<button class="common-btn-sm-ghost " use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}>
			<span><ThemesIcon size={18} /></span>
			<span class="hidden sm2:inline-flex">Theming</span>
		</button>
		<div class="card p-4 w-60 shadow-xl" data-popup="theme">
			<ThemeButton />
		</div>
		<button class="common-btn-sm-ghost" on:click={() =>modalStore.trigger({ type: 'component', component: 'modalSearch'})}>
			<span><SearchIcon size={18} /></span>
			<span class="hidden sm2:inline-block">Search</span>
			<small class="hidden sm2:inline-block sm2:badge sm2:variant-glass opacity-50">{isOsMac ? '⌘' : 'Ctrl'}+K</small>
		</button>
		{#if $ndkActiveUser}
		<div class="btn-group variant-ghost grid grid-cols-[1fr_auto] ">
			<button 
				class="!text-sm hover:variant-filled hover:!text-surface-50-900-token" 
				type="button"
				on:click={() => goto("/new")}
				>
				<span><EditIcon size={20} /></span>
				<span class="hidden sm2:inline-flex">Manage Lists</span>
			</button>
			<button 
				class="!text-sm hover:variant-filled hover:!text-surface-50-900-token" 
				type="button"
				on:click={() => modalStore.trigger({ type: 'component', component: 'modalCreateList',})}
				>
				<PlusSmall size={18} />
			</button>
		</div>
		<button
		class="common-btn-sm-ghost"
		on:click={() => goto(`/${$localStore.UserIdentifier ? $localStore.UserIdentifier : $ndkActiveUser?.npub}`)}
		>
			<span><ProfileIcon size={20} /></span>
			<span class="hidden sm2:inline-flex">Profile</span>
		</button>
		<button
			class="common-btn-sm-ghost-error"
			on:click={logout}
		>
			<span><LogoutIcon size={20} /></span>
		</button>
		{:else}
		<Login mode={"primary-sm"}/>
		{/if}
	</div>
	<button on:click={drawerOpen} class="common-btn-icon-ghost sm:!hidden"
	>
		<HamburgerIcon size={20} />
	</button>
</svelte:fragment>
</AppBar>
