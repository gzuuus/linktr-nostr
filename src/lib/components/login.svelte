<script lang="ts">
  export let mode: string | undefined = 'primary';
  export let doGoto: boolean = true;
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  // import { NDKlogin } from "$lib/utils/helpers";
    import { localStore } from "$lib/stores/stores";
    import { get } from "svelte/store";

  const modalStore = getModalStore();
	const modal: ModalSettings = {
		type: 'component',
		component: 'modalLogin',
	}
  async function login() {
    // TODO: improve ux here, redirect after login
    modalStore.trigger(modal)
    }

  $: buttonClass =
    mode === 'primary-sm' && $page.url.href !== `${$page.url.origin}/`
      ? 'common-btn-sm-filled'
      : mode === 'primary'
      ? 'common-btn-filled'
      : mode === 'secondary' && $page.url.href !== `${$page.url.origin}/`
      ? 'common-btn-sm-ghost'
      : mode === 'drawer'
      ? 'common-btn-filled justify-start w-full hover:text-current'
      : 'hidden';
</script>

<button type="button" class='{buttonClass}' on:click={login}>
  {#if mode == 'drawer'}
  <span><ProfileIcon size={20} /></span>
  {/if}
  <span>Login</span>
</button>
