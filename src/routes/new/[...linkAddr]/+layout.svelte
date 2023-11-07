<script lang="ts">
  import { ogImageUrl } from "$lib/utils/constants";
</script>

<svelte:head>
  <title>Manage lists</title>
  <meta name="description" content="MAnage your lists" />

  <meta property="og:title" content="Nostree" />
  <meta
    property="og:description"
    content="A Nostr-based application to create, manage and discover link lists, show notes and other stuff."
  />
  <meta property="og:image" content={ogImageUrl} />
</svelte:head>
<div class="common-container common-ring">
  <div class="common-container-content">
    <slot />
  </div>
</div>
