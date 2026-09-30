<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { AutocompleteOption } from "../stores";

  export let input: string = "";
  export let options: AutocompleteOption<string>[] = [];
  export let placeholder: string = "";
  export let limit: number = 10;
  export let emptyState: string = "No results";

  const dispatch = createEventDispatcher<{ selection: AutocompleteOption<string> }>();
  let open = false;

  $: filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(input.toLowerCase()) ||
      String(o.value).toLowerCase().includes(input.toLowerCase()) ||
      (o.keywords ?? "").toLowerCase().includes(input.toLowerCase()),
  );

  function select(option: AutocompleteOption<string>) {
    input = option.label;
    dispatch("selection", option);
    open = false;
  }
</script>

<div class="autocomplete relative {$$props.class ?? ''}">
  <input
    class="input w-full"
    type="text"
    {placeholder}
    bind:value={input}
    on:focus={() => (open = true)}
    on:input={() => (open = true)}
  />
  {#if open}
    <ul class="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto card p-1 shadow-xl list-none" role="listbox">
      {#if filtered.length === 0}
        <li class="p-2 opacity-60 text-sm">{emptyState}</li>
      {/if}
      {#each filtered.slice(0, limit) as option}
        <li role="option" aria-selected={input === option.label}>
          <button
            type="button"
            class="w-full text-left px-2 py-1 rounded-token hover:variant-soft"
            on:click={() => select(option)}>{option.label}</button
          >
        </li>
      {/each}
    </ul>
  {/if}
</div>

<svelte:window
  on:click={(e) => {
    if (!(e.target as HTMLElement).closest(".autocomplete")) open = false;
  }}
/>
