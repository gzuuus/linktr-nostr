<script lang="ts">
  import { ndkUser } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  import LogoutIcon from "$lib/elements/icons/logout-icon.svelte";
  import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
  import { logout } from "$lib/utils/helpers";
  import Login from "./login.svelte";
  import SearchIcon from "$lib/elements/icons/search-icon.svelte";
  import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
  import { Accordion, AccordionItem, getModalStore } from '@skeletonlabs/skeleton';
  import ThemeButton from "./theme-button.svelte";
  import ThemesIcon from "$lib/elements/icons/themes-icon.svelte";
  import EditIcon from "$lib/elements/icons/edit-icon.svelte";
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  import PlusSmall from "$lib/elements/icons/plus-small.svelte";
  const modalStore = getModalStore();
  const drawerStore = getDrawerStore();

	$: innerHeight = 0
</script>
<svelte:window bind:innerHeight/>
<div class="flex flex-col justify-between h-full">
  <nav class="list-nav p-4 -m-4 overflow-y-auto">        
    <ul>
      {#if $ndkUser}
      <li>
        <button
          class="option w-full h-full variant-soft"
          on:click={() => {
            goto(`/${$ndkUser?.npub}`)
            drawerStore.close();}}
        >
          <span><ProfileIcon size={20} /></span>
          <span class="flex-auto text-left">Go to profile</span>
        </button>
      </li>
      <li>
        <div class="option btn-group variant-soft grid grid-cols-[1fr_auto] ">
          <button 
            class="justify-self-start" 
            on:click={() => {
              goto("/new")
              drawerStore.close()}}
            >
            <span><EditIcon size={20} /></span>
            <span>Manage Lists</span>
          </button>
          <button 
            class="!text-sm hover:variant-filled hover:!text-surface-50-900-token" 
            on:click={() => {
              modalStore.trigger({ type: 'component', component: 'modalCreateList',})
              drawerStore.close()}}
            >
            <PlusSmall size={18} />
          </button>
        </div>
      </li>
      {/if}
      </ul>
      <ul>
      <li class:hidden={$ndkUser}>
        <Login mode={"drawer"}/>
      </li>
      <li>
        <button
          class="option w-full h-full variant-soft"
          on:click={() => {
            goto('/search')
            drawerStore.close();
            }}
        >
        <span><SearchIcon size={18} /></span>
        <span class="flex-auto text-left">Search</span>
        </button>
      </li>
      <li>
        <button
          class="option w-full h-full variant-soft"
          on:click={() => {
            goto('/explore')
            drawerStore.close();
            }}
        >
        <span><ExploreIcon size={18} /></span>
        <span class="flex-auto text-left">Explore</span>
        </button>
      </li>
    </ul>
  </nav>
  <nav class="list-nav p-4 -m-4 overflow-y-auto">
      <ul>
      <li class:hidden={!$ndkUser}>
          <button
            class="option w-full h-full variant-soft-error"
            on:click={() => {
              logout();
              drawerStore.close();
            }}
          >
            <span><LogoutIcon size={20} /></span>
            <span class="flex-auto text-left">LogOut</span>
          </button>
      </li>      
      <li>
        <Accordion>
          <AccordionItem>
            <svelte:fragment slot="lead"><ThemesIcon size={18} /></svelte:fragment>
            <svelte:fragment slot="summary">Theming</svelte:fragment>
            <svelte:fragment slot="content">
              <ThemeButton widgetLayout={innerHeight > 740 ? "max-h-72" : innerHeight > 640 ? "max-h-48" : innerHeight > 570 ? "max-h-32" : "max-h-24"} />
            </svelte:fragment>
          </AccordionItem>
        </Accordion>
      </li>
    </ul>
  </nav>
</div>