<script lang="ts">
  import Logo from "$lib/elements/icons/logo.svelte";
  import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
  import { goto } from "$app/navigation";
  import SearchIcon from "$lib/elements/icons/search-icon.svelte";
  import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
  import ThemeButton from "./theme-button.svelte";
  import ThemesIcon from "$lib/elements/icons/themes-icon.svelte";
	import type { ModalSettings} from '@skeletonlabs/skeleton';
	import { AppBar, popup, getModalStore } from '@skeletonlabs/skeleton';
  import ThreeDotsIcon from "$lib/elements/icons/three-dots-icon.svelte";
  import UserMenu from "./user-menu.svelte";
  const modalStore = getModalStore();

  function triggerSearch(): void {
		// const modal: ModalSettings = {
		// 	type: 'component',
		// 	component: 'modalSearch',
		// 	position: 'item-start'
		// };
		// modalStore.trigger(modal);

  const modal: ModalSettings = {
      type: 'component',
      component: 'modalSearch',
  }
  modalStore.trigger(modal);
	}
	function onWindowKeydown(e: KeyboardEvent): void {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			$modalStore.length ? modalStore.close() : triggerSearch();
		}
	}
</script>
<svelte:window on:keydown|stopPropagation={onWindowKeydown} />

<AppBar background=" bg-transparent" slotTrail="!space-x-2">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<a class="lg:!ml-0 w-[32px] lg:w-auto overflow-hidden" href="/" title="Go to Homepage">
				<Logo size={32} />
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div class="relative hidden lg:block">
			<button class="common-btn-icon-ghost" on:click={() => goto('/explore')}>
				<ExploreIcon size={18} />
			</button>
		</div>

		<div class="relative hidden lg:block">
			<button class="common-btn-icon-ghost" use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}>
				<span class="hidden md:inline-block"><ThemesIcon size={18} /></span>
			</button>
      <div class="card p-4 w-60 shadow-xl" data-popup="theme">
        <ThemeButton />
      </div>
		</div>


			<button class="common-btn-icon-ghost" use:popup={{ event: 'click', target: 'userMenu', closeQuery: 'a[href]' }}>
				<span class="md:inline-block"><ProfileIcon size={18} /></span>
			</button>
      <div class="card p-4 w-60 shadow-xl" data-popup="userMenu">
        <UserMenu />
      </div>
    <div class="relative hidden lg:block">
      <button class="common-btn-icon-ghost" on:click={triggerSearch}>
				<SearchIcon size={18} />
			</button>
		</div>

    <!-- Hamburger Menu -->
			<button on:click={() => console.log("clicked")} class="common-btn-icon-ghost lg:!hidden" use:popup={{ event: 'click', target: 'hamburgerMenu', closeQuery: 'a[href]' }}>
				<ThreeDotsIcon size={20} />
			</button>
      <div class="card p-4 w-60 shadow-xl" data-popup="hamburgerMenu">
        <div class="flex flex-col gap-2">
          <div class="space-y-4">
            <nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
              <ul>
                <li>
                  <button
                    class="option w-full h-full variant-soft"
                    on:click={triggerSearch}
                  >
                  <span><SearchIcon size={18} /></span>
                  <span class="flex-auto text-left">Search</span>
                  </button>
                </li>
                <li>
                  <button
                    class="option w-full h-full variant-soft"
                    on:click={() => goto('/explore')}
                  >
                  <span><ExploreIcon size={18} /></span>
                  <span class="flex-auto text-left">Explore</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <ThemeButton />
          </div>
        </div>
      </div>
	</svelte:fragment>
</AppBar>
