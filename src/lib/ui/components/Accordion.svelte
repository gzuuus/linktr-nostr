<script lang="ts">
  import { setContext } from "svelte";

  export let padding: string = "py-2 px-4";
  export let spacing: string = "space-y-2";
  export let regionControl: string = "";
  export let regionPanel: string = "";
  export let regionCaret: string = "";

  setContext("accordion", { padding, spacing, regionControl, regionPanel, regionCaret });
</script>

<div class="accordion {spacing} {$$props.class ?? ''}">
  <slot />
</div>
