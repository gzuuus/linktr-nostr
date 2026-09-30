<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/header.svelte";
  import { ogImageUrl } from "$lib/utils/constants";
  import { Modal, Toast, type ModalComponent } from "$lib/ui";
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
  import nostrClientStore, { autoLoginStore, activeUser } from "$lib/stores/provider";
  import { get } from "svelte/store";
  import { NIP05_REGEX } from "nostr-tools/nip05";
  import { autoLoginHandler } from "$lib/utils/helpers";

  const modalRegistry: Record<string, ModalComponent> = {
    modalPublishKind1: { ref: PublishKind1Modal },
    modalSearch: { ref: SearchWidget },
    modalNoNip07: { ref: NoExtensionModal },
    modalLoading: { ref: LoadingBackdropModal },
    modalCreateList: { ref: CreateNewListWidget },
    modalRelayList: { ref: RelayListModal },
    modalLogin: { ref: LoginModal },
  };
  storePreview.subscribe(setBodyThemeAttribute);
  storeTheme.subscribe(setBodyThemeAttribute);

  function setBodyThemeAttribute(): void {
    if (!browser) return;
    document.body.setAttribute("data-theme", $storePreview ? "customTheme" : $storeTheme);
  }
  if (browser && $localStore && get(autoLoginStore)) {
    if ($localStore.lastUserLogged) {
      let user = $nostrClientStore.getUser({
        pubkey: $localStore.lastUserLogged,
      });
      activeUser.set(user);
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
<div class="flex flex-col h-full scroll-smooth">
  <header class="fixed sm:sticky top-0 z-10 w-full">
    <Header />
  </header>
  <main class="grid place-content-center h-full sm:py-6 flex-1">
    <slot />
  </main>
</div>
