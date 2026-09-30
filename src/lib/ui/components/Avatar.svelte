<script lang="ts">
  export let src: string | undefined = undefined;
  export let fallback: string | undefined = undefined;
  export let initials: string | undefined = undefined;
  export let width: string = "w-16";
  export let border: string = "";
  export let rounded: string = "rounded-full";
  export let cursor: string = "cursor-pointer";
  export let background: string = "bg-surface-400-500-token";
  export let alt: string | undefined = undefined;

  let errored = false;
  $: imageSrc = !errored && src ? src : fallback;
  $: initialsText = (initials ?? alt ?? "?").trim().slice(0, 2).toUpperCase();
</script>

<div
  class="avatar flex items-center justify-center overflow-hidden {width} aspect-square {rounded} {border} {cursor} {background} {$$props.class ??
    ''}"
>
  {#if imageSrc}
    <img class="w-full h-full object-cover" src={imageSrc} {alt} on:error={() => (errored = true)} />
  {:else}
    <span class="font-bold text-surface-50-900-token select-none">{initialsText}</span>
  {/if}
</div>
