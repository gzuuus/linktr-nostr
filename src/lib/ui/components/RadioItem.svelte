<script lang="ts">
  export let group: any;
  export let name: string;
  export let value: any;
  export let active: string = "variant-filled";
  export let hover: string = "hover:variant-soft";
  export let rounded: string = "rounded-token";
  export let padding: string = "px-4 py-1";

  $: checked = group === value;
</script>

<label
  class="radio-item flex-auto cursor-pointer text-center transition {padding} {rounded} {checked
    ? active
    : hover} {$$props.class ?? ''}"
>
  <input class="hidden" type="radio" bind:group {name} {value} />
  <slot />
</label>
