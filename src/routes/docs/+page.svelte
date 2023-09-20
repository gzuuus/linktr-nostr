<script lang="ts">
  import InfoDialog from "$lib/components/info-dialog.svelte";
    import DocListHashtags from "$lib/docsComponents/doc-list-hashtags.svelte";
  import DocListNaddrShare from "$lib/docsComponents/doc-list-naddr-share.svelte";
  import DocListSlugSame from "$lib/docsComponents/doc-list-slug-same.svelte";
  import DocListSlugShare from "$lib/docsComponents/doc-list-slug-share .svelte";
  import DocListSlug from "$lib/docsComponents/doc-list-slug.svelte";
  import DocNewList from "$lib/docsComponents/doc-new-list.svelte";
  import DocOldLists from "$lib/docsComponents/doc-old-lists.svelte";
  import { Disclose } from "agnostic-svelte";
</script>

<div class="commonContainerStyle">
  <h1>Docs</h1>
  <Disclose isBackground title="Create New lists">
    <DocNewList />
    <Disclose isBackground title="What are slugs?">
      <DocListSlug />
      <Disclose isBackground title="Lists with same slug">
        <DocListSlugSame />
      </Disclose>
    </Disclose>
    <Disclose isBackground title="What are hashtags?">
      <DocListHashtags />
    </Disclose>
  </Disclose>

  <Disclose isBackground title="Sharing lists">
    <DocListSlugShare />
    <hr />
    <DocListNaddrShare />
  </Disclose>
  <Disclose isBackground title="Migrate Old Lists">
    <DocOldLists />
  </Disclose>
</div>

<style>
</style>
