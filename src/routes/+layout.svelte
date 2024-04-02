<script lang="ts">
  import "../app.postcss";
  import Header from "$lib/components/header.svelte";
  import { ogImageUrl } from "$lib/utils/constants";
  import { AppShell, Modal, Toast, type ModalComponent} from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { initializeStores } from '@skeletonlabs/skeleton';
  import PublishKind1Modal from "$lib/components/modals/publish-kind1-modal.svelte";
  import SearchWidget from "$lib/components/modals/search-widget-modal.svelte";
  import Drawers from "$lib/components/drawers.svelte";
  import NoExtensionModal from "$lib/components/modals/no-extension-modal.svelte";
  import LoadingBackdropModal from "$lib/components/modals/loading-backdrop-modal.svelte";
  import RelayListModal from "$lib/components/modals/relay-list-modal.svelte";
  import CreateNewListWidget from "$lib/components/create-new-list-widget.svelte";
  import { storePreview, storeTheme } from "$lib/stores/stores";
  import { browser } from "$app/environment";
  import { localStore } from "$lib/stores/stores";
  import { userCustomTheme } from "$lib/stores/user";
  import LoginModal from "$lib/components/modals/login-modal.svelte";
    import ndkStore, { autoLoginStore, ndkActiveUser } from "$lib/stores/provider";
    import { get } from "svelte/store";
    import { NIP05_REGEX } from "nostr-tools/nip05";
    import { autoLoginHandler } from "$lib/utils/helpers";

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  const modalRegistry: Record<string, ModalComponent> = {
	modalPublishKind1: { ref: PublishKind1Modal},
  modalSearch: { ref: SearchWidget },
  modalNoNip07: { ref: NoExtensionModal},
  modalLoading: { ref: LoadingBackdropModal},
  modalCreateList: { ref: CreateNewListWidget},
  modalRelayList: { ref: RelayListModal},
  modalLogin: { ref: LoginModal},
};
	storePreview.subscribe(setBodyThemeAttribute);
	storeTheme.subscribe(setBodyThemeAttribute);

	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storePreview ? 'customTheme' : $storeTheme);
	}
  if (browser && $localStore && get(autoLoginStore)){
    if ($localStore.lastUserLogged) {
      let user = $ndkStore.getUser({
        pubkey: $localStore.lastUserLogged,
      });
      ndkActiveUser.set(user);
      autoLoginHandler();
    }
    if ($localStore.lastUserTheme) {
      storeTheme.set($localStore.lastUserTheme);
      userCustomTheme.set({
        UserTheme: $localStore.lastUserTheme,
        themeIdentifier: undefined,
        themeCustomCss: undefined,
      });
    }
  }
</script>

<svelte:head>
  <title>Nostree</title>
  <meta
    name="description"
    content="A Nostr-based application to create, manage and discover link lists, show notes and other stuff."
  />
  <meta property="og:title" content="Nostree" />
  <meta
    property="og:description"
    content="A Nostr-based application to create, manage and discover link lists, show notes and other stuff."
  />
  <meta property="og:image" content={ogImageUrl} />
</svelte:head>
<Modal components={modalRegistry} />
<Toast position="t" />
<Drawers />
<AppShell slotPageHeader="fixed sm:sticky top-0 z-10 w-full" regionPage="scroll-smooth">
	<svelte:fragment slot="pageHeader">
    <Header />
  </svelte:fragment>
  <div class="grid place-content-center h-full sm:py-6">
    <slot />
  </div>
</AppShell>
