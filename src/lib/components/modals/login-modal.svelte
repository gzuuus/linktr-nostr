<script lang="ts">
    import { goto } from "$app/navigation";
    import LoginMenu from "$lib/components/login-menu.svelte";
    import CloseIcon from "$lib/elements/icons/close-icon.svelte";
    import { loginWithExtension } from "$lib/stores/provider";
    import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
    import { errorLogin, succesLogin } from "$lib/utils/constants";
    export let parent: any;

    const modalStore = getModalStore();
    const toastStore = getToastStore();

    const isNip07Available =
      typeof window !== "undefined" && typeof (window as any).nostr !== "undefined";

    let isExtensionLoggingIn = false;

    async function handleExtensionLogin(): Promise<void> {
      if (isExtensionLoggingIn) return;
      isExtensionLoggingIn = true;
      modalStore.trigger({ type: "component", component: "modalLoading" });

      const success = await loginWithExtension();
      modalStore.clear();
      toastStore.trigger(success ? succesLogin : errorLogin);

      if (success) {
        parent.onClose();
      }

      isExtensionLoggingIn = false;
    }
</script>
<div class="card p-4 shadow-xl space-y-4">
    <header class="common-2xl-header text-end">
        <button class="common-btn-icon-filled" on:click={parent.onClose}><CloseIcon size={20} /></button>
    </header>

    {#if isNip07Available}
      <button class="common-btn-filled w-full" on:click={handleExtensionLogin} disabled={isExtensionLoggingIn}>
        {isExtensionLoggingIn ? "Connecting..." : "Login with NIP-07 extension"}
      </button>
    {:else}
      <button class="common-btn-filled w-full" on:click={() => modalStore.trigger({ type: "component", component: "modalNoNip07" })}>
        No NIP-07 extension detected
      </button>
    {/if}

    <LoginMenu/>

    <footer class="{parent.regionFooter}">
    </footer>
</div>