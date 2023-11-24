<script lang="ts">
    import PlaceHolderLoading from "$lib/components/placeHolderLoading.svelte";
    import SetProfileTheme from "$lib/components/set-profile-theme.svelte";
    import DocsThemer from "$lib/components/themer-components/DocsThemer.svelte";
    import ChevronIconHorizontal from "$lib/elements/icons/chevron-icon-horizontal.svelte";
    import ndk from "$lib/stores/provider";
    import { storeTheme } from "$lib/stores/stores";
    import { ndkUser } from '$lib/stores/user';
    import { kindCSSReplaceableAsset } from "$lib/utils/constants";
    import DeleteEventData from "$lib/utils/deleteEventData.svelte";
    import { setCustomStyles, sortEventList, unixToDate } from "$lib/utils/helpers";
    import { NDKSubscriptionCacheUsage, type NDKFilter, type NDKKind, type NDKUserProfile, NDKEvent } from "@nostr-dev-kit/ndk";

    let eventList: NDKEvent[] = [];
    let themesCarrousel: HTMLDivElement;

    async function fetchCssAsset() {
    let ndkFilter: NDKFilter = {authors: [$ndkUser!.pubkey], kinds: [kindCSSReplaceableAsset as NDKKind], "#L": ["nostree-theme"]}
    await $ndk
      .fetchEvents(ndkFilter, {
        closeOnEose: true,
        groupable: true,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      })
      .then((fetchedEvent) => {
        eventList = Array.from(fetchedEvent);
        sortEventList(eventList);
      });
  }

  function multiColumnLeft(): void {
    let x = themesCarrousel.scrollWidth;
    if (themesCarrousel.scrollLeft !== 0) x = themesCarrousel.scrollLeft - themesCarrousel.clientWidth;
    themesCarrousel.scroll(x, 0);
  }

  function multiColumnRight(): void {
    let x = 0;
    if (themesCarrousel.scrollLeft < themesCarrousel.scrollWidth - themesCarrousel.clientWidth - 1) x = themesCarrousel.scrollLeft + themesCarrousel.clientWidth;
    themesCarrousel.scroll(x, 0);
  }
</script>
{#if $ndkUser}
{#await fetchCssAsset()}
<PlaceHolderLoading colCount={6} />
{:then value} 
    {#if eventList.length > 0}
    <div class="grid grid-cols-[auto_1fr_auto] gap-2 items-center">
      <button type="button" class="btn-icon btn-icon-sm variant-filled" on:click={multiColumnLeft}>
        <ChevronIconHorizontal flipHorizontal={true} size={18} />
      </button>
      <div bind:this={themesCarrousel} class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-x-auto">
        {#each eventList as event}
          <div class="snap-start shrink-0 card py-20 w-40 md:w-80 text-center flex flex-col items-center">
              {event.tagValue('title')}
              <button 
                class="common-btn-sm-ghost w-fit" 
                on:click={() => {
                  storeTheme.set(event.tagValue('l') || '');
                  if (event.content) {
                    setCustomStyles(event.content);
                  }
                }}
              >
              Try theme
              </button>
              <DeleteEventData
                eventToPublish={event}
              />
              <SetProfileTheme cssOutput={event.content || ''} isNewCustomTheme={false} themeName={event.tagValue('l') || ''} themeLabel={event.tagValue('l') || ''}/>
              {unixToDate(event.created_at)}
          </div>
        {/each}
      </div>
      <button type="button" class="btn-icon btn-icon-sm variant-filled" on:click={multiColumnRight}>
        <ChevronIconHorizontal flipHorizontal={false} size={18} />
      </button>
    </div>
    {/if}
{/await}
{/if}
{#if typeof document != "undefined"}
<DocsThemer />
{/if}