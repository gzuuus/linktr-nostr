<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const STORAGE_KEY = "mode";
  let dark = false;
  let ready = false;

  function apply() {
    document.documentElement.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {}
  }

  onMount(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    apply();
    ready = true;
  });

  function toggle() {
    dark = !dark;
    apply();
  }
</script>

<button
  type="button"
  class="btn btn-sm variant-ghost inline-flex items-center gap-2"
  on:click={toggle}
  aria-label="Toggle dark mode"
  title={dark ? "Switch to light mode" : "Switch to dark mode"}
>
  {#if ready}
    {#if dark}
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"
        ><path
          d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-5.4-5.4c0-1.61.72-3.06 1.86-4.03A9.4 9.4 0 0 0 12 3z"
        /></svg
      >
    {:else}
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        ><circle cx="12" cy="12" r="4" /><path
          d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        /></svg
      >
    {/if}
  {:else}
    <span class="w-5 h-5 inline-block"></span>
  {/if}
</button>
