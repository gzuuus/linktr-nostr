<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: string[] = [];
  export let name: string = "";
  export let placeholder: string = "";
  export let allowDuplicates: boolean = false;
  export let max: number = Infinity;
  export let input: string = "";

  const dispatch = createEventDispatcher();

  function addChip() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!allowDuplicates && value.includes(trimmed)) {
      input = "";
      return;
    }
    if (value.length >= max) return;
    value = [...value, trimmed];
    dispatch("add", { chipValue: trimmed });
    input = "";
  }

  function removeChip(index: number) {
    const removed = value[index];
    value = value.filter((_, i) => i !== index);
    dispatch("remove", { chipValue: removed });
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === "," || e.key === ";") {
      e.preventDefault();
      addChip();
    } else if (e.key === "Backspace" && input === "" && value.length) {
      removeChip(value.length - 1);
    }
  }
</script>

<div
  class="input-group input-chip flex flex-wrap items-center gap-2 p-2 rounded-container-token border border-surface-500/30 bg-surface-50-900-token"
>
  {#each value as chip, i}
    <button
      type="button"
      class="chip variant-soft inline-flex items-center gap-1"
      on:click={() => removeChip(i)}
      title="Remove {chip}"
    >
      {chip}<span aria-hidden="true">×</span>
    </button>
  {/each}
  <input
    class="flex-auto min-w-[8rem] bg-transparent border-0 outline-none p-1"
    type="text"
    {name}
    {placeholder}
    bind:value={input}
    on:keydown={onKeydown}
    on:blur={addChip}
  />
</div>
