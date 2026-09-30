<script lang="ts">
  import { modalStore, type ModalComponent } from "../stores";
  import { fade, fly } from "svelte/transition";

  export let components: Record<string, ModalComponent> = {};
  export let position: string = "items-center justify-center";

  $: current = $modalStore[0];
  $: componentRef =
    typeof current?.component === "string" ? components[current.component]?.ref : current?.component?.ref;

  const parent = {
    onClose: () => modalStore.close(),
    regionFooter: "flex justify-end gap-2 pt-4",
    regionHeader: "",
    regionBody: "",
    buttonNeutral: "btn variant-ghost",
    buttonPositive: "btn variant-filled",
    buttonTextCancel: "Cancel",
    buttonTextConfirm: "Confirm",
    buttonTextSubmit: "Submit",
  };

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) modalStore.close();
  }
  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && $modalStore.length) modalStore.close();
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if current}
  <div
    class="fixed inset-0 z-[998] flex {position} p-4 bg-surface-900/50 backdrop-blur-sm overflow-y-auto"
    on:click={onBackdrop}
    role="presentation"
    transition:fade={{ duration: 150 }}
  >
    <div transition:fly={{ y: 16, duration: 150 }}>
      <svelte:component this={componentRef} {parent} {...current.meta?.props ?? {}} />
    </div>
  </div>
{/if}
