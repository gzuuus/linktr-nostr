<script lang="ts">
  import "../app.postcss";
  import Header from "$lib/components/header.svelte";
  import { onMount } from "svelte";
  import ndk from "$lib/stores/provider";
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
  import { currentUserFollows, ndkUser, userCustomTheme } from "$lib/stores/user";
  import UpdateOldKindModal from "$lib/components/modals/update-old-kind-modal.svelte";

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  const modalRegistry: Record<string, ModalComponent> = {
	modalPublishKind1: { ref: PublishKind1Modal},
  modalSearch: { ref: SearchWidget },
  modalNoNip07: { ref: NoExtensionModal},
  modalLoading: { ref: LoadingBackdropModal},
  modalCreateList: { ref: CreateNewListWidget},
  modalRelayList: { ref: RelayListModal},
  modalUpdateOldKind: { ref: UpdateOldKindModal}
};
	storePreview.subscribe(setBodyThemeAttribute);
	storeTheme.subscribe(setBodyThemeAttribute);
  currentUserFollows.subscribe(setLocalFollows);
  function setLocalFollows(): void {
    if ($currentUserFollows.length == 0) return;
      localStore.update((currentState) => {
        return {
          lastUserLogged: currentState.lastUserLogged,
          lastUserTheme: currentState.lastUserTheme,
          currentUserFollows: $currentUserFollows ? $currentUserFollows : currentState.currentUserFollows || undefined,
          UserIdentifier: currentState.UserIdentifier
        };
      });
    }

	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storePreview ? 'customTheme' : $storeTheme);
	}
    if (browser && $localStore.lastUserLogged){
      let user = $ndk.getUser({
        npub: $localStore.lastUserLogged,
      });
      ndkUser.set(user);
      if ($localStore.currentUserFollows){
        currentUserFollows.set($localStore.currentUserFollows);
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

//---------SnowFlakes----------//
const SNOWFLAKES_COUNT: number = 80;
  const SNOWFLAKE_MIN_SCALE: number = 0.2;
  const MELTING_SPEED: number = 6.5;
  const WIND_FORCE: number = 0.03;
  const FALL_SPEED: number = 0.25;
  const SNOW_ICONS: string[] = ['❄️', '❅', '❄'];
  const TARGET_FPS: number = 25;

  const MS_BETWEEN_FRAMES: number = 1000 / TARGET_FPS;

  function randomSnowflakeConfig(i: number) {
    return {
      scale: SNOWFLAKE_MIN_SCALE + Math.random() * (1 - SNOWFLAKE_MIN_SCALE),
      x: -20 + Math.random() * 120,
      y: -100 + Math.random() * 200,
      rotation: Math.floor(Math.random() * 360),
      snowIcon: SNOW_ICONS[i % SNOW_ICONS.length],
      opacity: 0.8,
    };
  }

  let snowflakes = new Array(SNOWFLAKES_COUNT)
    .fill(undefined)
    .map((_, i) => randomSnowflakeConfig(i))
    .sort((a, b) => a.scale - b.scale);

  onMount(() => {
  let frame: number, lastTime: number;

  function loop(timestamp: number) {
    frame = requestAnimationFrame(loop);

    const elapsed = timestamp - lastTime;
    lastTime = timestamp;

    let framesCompleted = elapsed / MS_BETWEEN_FRAMES;

    if (isNaN(framesCompleted)) {
      framesCompleted = 1;
    }

    snowflakes = snowflakes.map((flake) => {
      if (flake.y >= 100) {
        flake.opacity = Math.pow(flake.opacity, MELTING_SPEED);
      } else {
        flake.y += FALL_SPEED * flake.scale * framesCompleted;
        flake.x += WIND_FORCE * flake.scale * framesCompleted;
        flake.rotation += 1 * framesCompleted;
      }
      if (flake.opacity <= 0.02) {
        flake.y = -20;
        flake.x = -20 + Math.random() * 120;
        flake.opacity = 0.70;
      }
      return flake;
    });
  }

  loop(0);

  return () => {
    cancelAnimationFrame(frame);
  };
});
//---------End SnowFlakes----------//
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
<div class="snowframe" aria-hidden="true">
  {#each snowflakes as flake}
    <div
      class="snowflake"
      style={`opacity: ${flake.opacity}; transform: scale(${flake.scale}) rotate(${flake.rotation}deg); left: ${flake.x}%; top: calc(${flake.y}% - ${flake.scale}rem)`}>
      {flake.snowIcon}
    </div>
  {/each}
</div>

<style>
  @import '$lib/elements/animations/general-animations.css';
    .snowframe {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      z-index: -1;
    }
    .snowflake {
    color: #fff;
    font-size: 1.2rem;
    line-height: 1.2rem;
    font-family: Arial, sans-serif;
    text-shadow: 0 0 15px #ffffff63;
    position: absolute;
    z-index: -10;
  }
</style>
