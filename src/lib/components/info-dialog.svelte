<script lang="ts">
  export let whatInfo: string | undefined = "";
  export let showInfoIcon: boolean = true;
  export let InfoIconSize: number = 18;
  export let buttonText: string | undefined = "";
</script>

<div class="relative inline-block">
  {#if showInfoIcon}
    <button
      class="info-button"
      on:click={() => {
        const dialog = document.getElementById(whatInfo) as HTMLDialogElement;
        dialog?.showModal();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={InfoIconSize}
        height={InfoIconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-info"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </button>
  {:else if buttonText}
    <button
      class="text-button"
      on:click={() => {
        const dialog = document.getElementById(whatInfo) as HTMLDialogElement;
        dialog?.showModal();
      }}
    >
      {buttonText}
    </button>
  {/if}
</div>

<style>
  .info-button {
    @apply inline-flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-gray-500;
  }

  .text-button {
    @apply text-gray-400 hover:text-gray-500;
  }
</style>