<script lang="ts">
  import { getContext } from "svelte";
  import { slide } from "svelte/transition";

  export let open: boolean = false;
  export let regionControl: string | undefined = undefined;
  export let regionPanel: string = "";
  export let padding: string | undefined = undefined;

  const ctx = getContext<any>("accordion");
  $: ctrlPadding = padding ?? ctx?.padding ?? "py-2 px-4";
  $: ctrlClass = regionControl ?? ctx?.regionControl ?? "";
  $: panelClass = regionPanel || ctx?.regionPanel || "";
</script>

<div class="accordion-item">
  <button
    type="button"
    class="w-full flex items-center gap-2 {ctrlPadding} {ctrlClass} rounded-container-token hover:brightness-110 transition"
    on:click={() => (open = !open)}
    aria-expanded={open}
  >
    {#if $$slots.lead}<span class="flex-none"><slot name="lead" /></span>{/if}
    <span class="flex-auto text-left font-bold"><slot name="summary" /></span>
    <svg
      class="flex-none w-4 h-4 transition-transform {open ? 'rotate-180' : ''}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"><path d="m6 9 6 6 6-6" /></svg
    >
  </button>
  {#if open}
    <div class="accordion-panel {ctrlPadding} {panelClass}" transition:slide={{ duration: 150 }}>
      <slot name="content" />
    </div>
  {/if}
</div>
