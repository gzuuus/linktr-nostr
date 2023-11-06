<script lang="ts">
  export let mode: string | undefined = 'primary';
  export let doGoto: boolean = true;
  import { NDKNip07Signer, type NDKFilter, NDKKind, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import ndk from "$lib/stores/provider";
  import { ndkUser, userCustomTheme } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
  import type { ModalSettings } from "@skeletonlabs/skeleton";
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { defaulTheme, kindCSSReplaceableAsset } from "$lib/utils/constants";
  import { setCustomStyles } from "$lib/utils/helpers";
  import { storeTheme } from "$lib/stores/stores";
			
  const modalStore = getModalStore();
	const modal: ModalSettings = {
		type: 'component',
		component: 'modalNoNip07',
	}
  async function login() {
    try {
      const signer = new NDKNip07Signer();
      $ndk.signer = signer;
      ndk.set($ndk);
      const ndkCurrentUser = await signer.user();
      let user = $ndk.getUser({
        npub: ndkCurrentUser.npub,
      });
      ndkUser.set(user);
      fetchCssAsset(user.hexpubkey());
      if (doGoto) {
        goto(`/${ndkCurrentUser.npub}`);
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error instanceof Error) {
        if (error.message.includes("NIP-07 extension not available")) {
          console.error("NIP-07 extension not available:", error)
          modalStore.trigger(modal)
        } else if (error.message.includes("Prompt was closed")) {
          console.error("Prompt was closed:", error);
        } else {
          console.error("Error on login:", error);
        }
      } else {
        console.error("Error on login:", error);
      }
    }
  }
  async function fetchCssAsset(user:string) {
    let ndkFilter: NDKFilter = {
      authors: [user], 
      kinds: [kindCSSReplaceableAsset as NDKKind], 
      "#L": ["nostree-theme"]
    };
    await $ndk
      .fetchEvent(ndkFilter, {
        closeOnEose: true,
        groupable: true,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      })
      .then((fetchedEvent) => {
        if (fetchedEvent) {
          const userTheme = fetchedEvent.tagValue('l');
          const themeIdentifier = fetchedEvent.tagValue('d');
          const themeCustomCss = fetchedEvent.content;
          
          userCustomTheme.set({
            UserTheme: userTheme || undefined,
            themeIdentifier: themeIdentifier || undefined,
            themeCustomCss: themeCustomCss || undefined,
          });

          storeTheme.set($storeTheme == defaulTheme ? userTheme! : $storeTheme);

          if (fetchedEvent.content) {
            setCustomStyles(fetchedEvent.content);
          }
        }
      });

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

<button class='{buttonClass}' on:click={login}>
  {#if mode == 'drawer'}
  <span><ProfileIcon size={20} /></span>
  {/if}
  <span>Login</span>
</button>
