<script lang="ts">
    import DocListHashtags from "$lib/docsComponents/doc-list-hashtags.svelte";
  export let whatInfo: string | undefined = "";
  export let showInfoIcon: boolean = true;
  export let InfoIconSize: number = 18;
  export let buttonText: string | undefined = "";
  import DocListNaddrShare from "$lib/docsComponents/doc-list-naddr-share.svelte";
  import DocListSlugShare from "$lib/docsComponents/doc-list-slug-share .svelte";
  import DocListSlug from "$lib/docsComponents/doc-list-slug.svelte";
  import DocNewList from "$lib/docsComponents/doc-new-list.svelte";
  import DocOldLists from "$lib/docsComponents/doc-old-lists.svelte";
  import InfoIcon from "$lib/elements/icons/info-icon.svelte";

  let isModalVisible: boolean = false;
</script>

<button
  type="button"
  class="inputWithIcon switchButtons noBorder noPadding"
  on:click={() => (isModalVisible = !isModalVisible)}
>
  {buttonText}
  {#if showInfoIcon}
    <InfoIcon size={InfoIconSize} />
  {/if}
</button>

{#if isModalVisible}
  <div class="modal">
    <div class="modal-content">
      {#if whatInfo == "list-slug"}
        <DocListSlug />
      {:else if whatInfo == "new-list"}
        <DocNewList />
      {:else if whatInfo == "list-slug-share"}
        <DocListSlugShare />
      {:else if whatInfo == "list-naddr-share"}
        <DocListNaddrShare />
      {:else if whatInfo == "list-old-format-migrate"}
        <DocOldLists />
      {:else if whatInfo == "list-hashtags"}
        <DocListHashtags />
      {/if}
      <div class="closeModal">
        <button type="button" on:click={() => (isModalVisible = false)}>👍</button>
      </div>
    </div>
  </div>
{/if}

<style>
</style>
