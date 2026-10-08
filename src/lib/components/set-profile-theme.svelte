<script lang="ts">
  export let cssOutput: string | undefined = "";
  export let isNewCustomTheme: boolean = false;
  export let themeName: string | undefined = "";
  export let themeLabel: string | undefined = "";
  import { getToastStore } from "$lib/ui";
  import { succesPublishToast, errorPublishToast, kindCSSReplaceableAsset, kindCSSAsset } from "$lib/utils/constants";
  import { NostrEvent } from "$lib/nostr/client";
  import nostrClient, { activeUser } from "$lib/stores/provider";
  import { getModalStore } from "$lib/ui";
  import { v4 as uuidv4 } from "uuid";
  import { userCustomTheme } from "$lib/stores/user";
  import { localStore, storeTheme } from "$lib/stores/stores";
  import { setCustomStyles } from "$lib/utils/helpers";

  const modalStore = getModalStore();
  const toastStore = getToastStore();
  let customStyleSheet: string;
  $: {
    if (typeof document != "undefined") {
      if ($storeTheme == "customTheme") {
        customStyleSheet = document.querySelector(`style#custom-style`)?.innerHTML ?? "";
      } else {
        customStyleSheet = cssOutput!;
      }
    }
  }
  $: eventIdentifier = $userCustomTheme.themeIdentifier
    ? $userCustomTheme.themeIdentifier
    : `nostree-theme-${uuidv4()}`;
  async function EventSubmit(): Promise<void> {
    if (!$nostrClient.signer) return;
    modalStore.trigger({ type: "component", component: "modalLoading" });
    const nostrEvent = new NostrEvent($nostrClient);
    nostrEvent.kind = kindCSSReplaceableAsset;
    nostrEvent.content = customStyleSheet;
    nostrEvent.tags = [
      [
        "d",
        isNewCustomTheme
          ? `nostree-theme-${uuidv4()}`
          : $userCustomTheme.themeIdentifier || `nostree-theme-${uuidv4()}`,
      ],
      ["title", themeName ? themeName : $storeTheme],
      ["L", "nostree-theme"],
      ["l", themeLabel ? themeLabel : $storeTheme],
    ];
    try {
      await nostrEvent.publish();
      modalStore.clear();
      toastStore.trigger(succesPublishToast);
      const userTheme = nostrEvent.tagValue("l");
      const themeIdentifier = nostrEvent.tagValue("d");
      const themeCustomCss = nostrEvent.content;
      userCustomTheme.set({
        UserTheme: userTheme || undefined,
        themeIdentifier: themeIdentifier || undefined,
        themeCustomCss: themeCustomCss || undefined,
      });
      localStore.update((currentState) => {
        return {
          ...currentState,
          lastUserTheme: userTheme,
        };
      });
      storeTheme.set(userTheme || "");

      if (nostrEvent.content) {
        setCustomStyles(nostrEvent.content);
      }
    } catch (error) {
      modalStore.clear();
      toastStore.trigger(errorPublishToast);
      console.log("Error:", error);
    }
  }
</script>

{#if $activeUser}
  <button class="btn variant-filled w-full" on:click={EventSubmit}>
    <span>{isNewCustomTheme ? "Publish theme" : "Use theme in profile"}</span>
  </button>
{/if}
