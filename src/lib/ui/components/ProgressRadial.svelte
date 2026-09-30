<script lang="ts">
  export let stroke: number = 20;
  export let meter: string = "stroke-primary-500";
  export let track: string = "stroke-surface-500/20";
  export let value: number | undefined = undefined;
  export let width: string = "w-12";
  export let font: number = 56;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  $: dashOffset =
    value === undefined ? circumference * 0.75 : circumference * (1 - Math.min(Math.max(value, 0), 100) / 100);
  $: spin = value === undefined;
</script>

<figure class="progress-radial {width} relative inline-flex items-center justify-center" data-testid="progress-radial">
  <svg class="w-full h-full {spin ? 'animate-spin' : ''}" style="transform-origin: center;" viewBox="0 0 100 100">
    <circle class={track} cx="50" cy="50" r={radius} stroke-width={stroke} fill="none" />
    <circle
      class="{meter} progress-radial-value"
      cx="50"
      cy="50"
      r={radius}
      stroke-width={stroke}
      fill="none"
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={dashOffset}
      transform="rotate(-90 50 50)"
    />
  </svg>
  {#if value !== undefined}
    <figcaption class="absolute text-sm" style="font-size: {font / 4}px">{value}%</figcaption>
  {/if}
</figure>

<style>
  .animate-spin {
    animation: pr-spin 1s linear infinite;
  }
  @keyframes pr-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
