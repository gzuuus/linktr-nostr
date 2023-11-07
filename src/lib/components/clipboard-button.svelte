<script lang="ts">
  import CopyIcon from '$lib/elements/icons/copy-icon.svelte';
  import IdIcon from '$lib/elements/icons/id-icon.svelte';
  import LinkOut from '$lib/elements/icons/link-out.svelte';
  import ShareIcon from '$lib/elements/icons/share-icon.svelte';
  export let contentToCopy: string;
  export let buttonIcon: string | undefined = "copy";
  export let buttonText: string | undefined = "";
  export let isButton: boolean = true;
  import { clipboard } from '@skeletonlabs/skeleton';
  import { sharePage } from '$lib/utils/helpers';

  let copied = false;
  function onClickHandler(): void {
    if (buttonIcon == "share"){
      sharePage(contentToCopy);      
    }
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1500);
  }
</script>
  
  <button 
    class= "{copied ? 
    isButton ? "btn btn-sm variant-ghost-success" : "flex gap-1" : 
    isButton ? "btn btn-sm variant-ghost w-fit" : "flex gap-1"
    }"
    use:clipboard={contentToCopy} 
    on:click={onClickHandler} 
    disabled={copied}
    >

    {#if copied}
      Copied!
    {:else}
    {buttonText}
    {#if buttonIcon != "none"}
      {#if buttonIcon == "link"}
        <LinkOut size={16} />
      {:else if buttonIcon == "id"}
        <IdIcon size={16} />
      {:else if buttonIcon == "share"}
        <ShareIcon size={16} />
      {:else if buttonIcon == "copy"}
        <CopyIcon size={16} />
      {/if}
    {/if}
    {/if}
  </button>
  