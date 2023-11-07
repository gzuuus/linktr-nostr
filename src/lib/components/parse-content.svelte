<script lang="ts">
  export let content: string;
  export let charLimit: number = 132;
  import { parseNostrUrls } from "$lib/utils/helpers";
  import PlusSmall from "$lib/elements/icons/plus-small.svelte";
  import MinusSmall from "$lib/elements/icons/minus-small.svelte";
  import MarkdownIt from "markdown-it";
  import LinkifyIt from "linkify-it";

  const md = new MarkdownIt();
  const linkify = new LinkifyIt();

  let parsedContent: string;
  let showMore: boolean = false;

  function parseLinks(rawContent: string): string {
    rawContent = parseNostrUrls(rawContent);

    const matches = linkify.match(rawContent);
    if (matches) {
      for (const match of matches) {
        if (isImageLink(match.url)) {
          rawContent = rawContent.replace(match.text, `<img src="${match.url}" alt="${match.text}" />`);
        } else if (isVideoLink(match.url)) {
          rawContent = rawContent.replace(
            match.text,
            `<video src="${match.url}" alt="${match.text}" controls></video>`
          );
        } else {
          rawContent = rawContent.replace(
            match.text,
            `<a href="${match.url}" target="_blank" rel="noopener noreferrer">${match.text}</a>`
          );
        }
      }
    }
    return rawContent;
  }
  function isImageLink(url: string): boolean {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url);
  }
  function isVideoLink(url: string): boolean {
    return /\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|3gp|ogv)$/i.test(url);
  }

  $: {
    const rawContent = md.render(content);
    parsedContent = parseLinks(rawContent);
  }

  function toggleShowMore() {
    showMore = !showMore;
  }

  function getTruncatedContent() {
    return parsedContent.length > charLimit ? parsedContent.slice(0, charLimit) + "..." : parsedContent;
  }
</script>
  {@html showMore ? parsedContent : getTruncatedContent()}

  {#if parsedContent.length > charLimit}
    <button class="common-btn-icon-ghost" on:click={toggleShowMore}>
      {#if showMore}
        <MinusSmall size={20} />
      {:else}
        <PlusSmall size={20} />
      {/if}
    </button>
  {/if}

<!-- <style>
  .showMoreButton {
    display: flex;
    background: var(--elements-b-color);
    border: 1px solid var(--hover-b-color);
    border-radius: var(--agnostic-radius);
    transition: all 0.2s ease-in-out;
    position: absolute;
    bottom: 0;
    padding: 0;
    right: 0;
    margin: 0.4em;
    color: white;
  }
  .showMoreButton:hover {
    background: var(--hover-b-color);
  }
</style> -->
