<script lang="ts">
  import { toastStore } from "../stores";
  import { fly } from "svelte/transition";

  export let position: "t" | "b" | "tr" | "tl" | "br" | "bl" | "l" | "r" = "b";
  export let max: number = 3;

  $: positionClass =
    position === "t"
      ? "top-4 left-1/2 -translate-x-1/2"
      : position === "b"
        ? "bottom-4 left-1/2 -translate-x-1/2"
        : position === "tr"
          ? "top-4 right-4"
          : position === "tl"
            ? "top-4 left-4"
            : position === "br"
              ? "bottom-4 right-4"
              : position === "bl"
                ? "bottom-4 left-4"
                : position === "l"
                  ? "top-1/2 left-4 -translate-y-1/2"
                  : "top-1/2 right-4 -translate-y-1/2";
</script>

{#if $toastStore.length}
  <div class="fixed z-[999] flex flex-col gap-2 pointer-events-none {positionClass}">
    {#each $toastStore.slice(-max) as toast (toast.id)}
      <div
        class="pointer-events-auto card px-4 py-3 shadow-xl {toast.background ?? 'variant-filled'} {toast.classes ??
          ''}"
        transition:fly={{ y: position.startsWith("t") ? -12 : 12, duration: 150 }}
        role="alert"
      >
        <div class="flex items-center gap-3">
          <span class="flex-auto text-sm">{toast.message}</span>
          {#if toast.action}
            <button
              class="btn btn-sm variant-ghost"
              on:click={() => {
                toast.action?.response();
                toastStore.close(toast.id);
              }}>{toast.action.label}</button
            >
          {/if}
          <button class="opacity-60 hover:opacity-100" on:click={() => toastStore.close(toast.id)}>✕</button>
        </div>
      </div>
    {/each}
  </div>
{/if}
