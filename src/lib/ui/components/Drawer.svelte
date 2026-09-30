<script lang="ts">
  import { drawerStore } from "../stores";
  import { fly, fade } from "svelte/transition";

  $: settings = $drawerStore;
  $: open = Boolean(settings?.id);
  $: position = settings.position ?? "left";
  $: width = settings.width ?? "w-[280px] md:w-[320px]";
  $: padding = settings.padding ?? "p-4";
  $: rounded = settings.rounded ?? "";
  $: shadow = settings.shadow ?? "shadow-xl";

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") drawerStore.close();
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-[997] bg-surface-900/50 backdrop-blur-sm"
    on:click={() => drawerStore.close()}
    role="presentation"
    transition:fade={{ duration: 150 }}
  ></div>
  <div
    class="fixed z-[998] top-0 h-full {position === 'right'
      ? 'right-0'
      : position === 'left'
        ? 'left-0'
        : ''} {width} {padding} {rounded} {shadow} bg-surface-50-900-token overflow-y-auto {$$props.class ?? ''}"
    role="dialog"
    aria-modal="true"
    transition:fly={{ x: position === "right" ? 320 : -320, duration: 180 }}
  >
    <slot />
  </div>
{/if}
