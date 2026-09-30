<script lang="ts">
  export let display: string = "flex";
  export let flexDirection: string = "flex-row";
  export let background: string = "bg-surface-400-500-token";
  export let border: string = "border border-surface-500/20";
  export let rounded: string = "rounded-container-token";
  export let gap: string = "gap-1";
  export let padding: string = "p-1";
</script>

<div
  class="radio-group {display} {flexDirection} {gap} {background} {border} {rounded} {padding} {$$props.class ?? ''}"
  role="radiogroup"
>
  <slot />
</div>
