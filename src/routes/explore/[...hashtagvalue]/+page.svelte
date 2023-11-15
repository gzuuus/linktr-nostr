<script lang="ts">
  import ndk from "$lib/stores/provider";
  import { unixToDate, findListTags, sortEventList, findOtherTags, naddrEncodeATags } from "$lib/utils/helpers";
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
  import { kindLinks, outNostrLinksUrl } from "$lib/utils/constants";
  import ForkIcon from "$lib/elements/icons/fork-icon.svelte";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import { nip19 } from "nostr-tools";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import PlaceHolderLoading from "$lib/components/placeHolderLoading.svelte";
  import SearchBar from "$lib/components/search-bar.svelte";
  import SearchIcon from "$lib/elements/icons/search-icon.svelte";
    import { onDestroy } from "svelte";
  let showForkInfo: boolean = false;
  let ndkFilter: NDKFilter
  let eventHashtags: string[] = [];
  let isSubscribe: boolean = false;
  let eventList: NDKEvent[] = [];
  let initialHashtagCount: number = 15;
  let showAllHashtags:boolean = false;
  let showSearchBar: boolean = false;
  let retryCounter = 0;
  $: {
    ndkFilter = $page.params.hashtagvalue
    ? { kinds: [kindLinks], "#t": [`${$page.params.hashtagvalue}`], "#l": ["nostree"], limit: 100 }
    : { kinds: [kindLinks], "#l": ["nostree"], limit: 100 };
  }
async function fetchEvents(filter: NDKFilter) {
  eventList = [];
  isSubscribe = true;
  eventHashtags= [];
  const sub = $ndk.subscribe(filter, { closeOnEose: false, groupable: false, cacheUsage: NDKSubscriptionCacheUsage.PARALLEL })
  sub.on("event", (event) => {
    eventList = [...eventList, event];
    event.tags.forEach((tag: string[]) => {
      if (tag[0] == "t" && !eventHashtags.includes(tag[1]) ) eventHashtags.push(tag[1]);
    });
    sortEventList(eventList);
  })
  sub.on("eose", () => {
    isSubscribe = false;
  })
  sub.on("notice", (notice) => {
    console.log(notice);
  })
}
onDestroy(() => {
  eventList = [];
  retryCounter = 10
})
</script>
<svelte:head>
  <title>{$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'}</title>
  <meta name="description" content={$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'} />
  <meta property="og:title" content={$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'}/>
  <meta property="og:description" content={$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'} />
</svelte:head>
{#key $page.url.href}
{#await fetchEvents(ndkFilter)}
  <div class="loading-global w-fit m-auto">
    <PlaceHolderLoading layoutKind={"avatar"} />
  </div>
  <h2 class:hidden={!$page.params.hashtagvalue}> #{$page.params.hashtagvalue}</h2>
  <PlaceHolderLoading colCount={5} />
{:then value }
  <h1 class="inline-flex justify-center">
    <button type="button" on:click={() => goto('/explore')}>
      <ExploreIcon size={25} />
    </button>Explore
  </h1>
  <h3 class:hidden={!$page.params.hashtagvalue}>#{$page.params.hashtagvalue}</h3>  
  <div class="flex flex-col gap-2">

    {#if isSubscribe }
      <PlaceHolderLoading colCount={3} listItemPadding="p-4" />
    {:else} 
    <div>
    {#each eventHashtags.slice(0, showAllHashtags ? eventHashtags.length : initialHashtagCount) as eventHashtag }
    <button on:click={() => goto(`/explore/${eventHashtag}`)}>
    <span class="common-badge-soft m-1">
        <HashtagIconcopy size={16} />
        {eventHashtag}
      </span>
    </button>
    {/each}
  </div>
  <div class=" flex flex-wrap justify-center gap-2">
    {#if eventHashtags.length > 10}
    <button class="common-btn-sm-ghost" type="button" on:click={() => showAllHashtags = !showAllHashtags}>
      {!showAllHashtags ? `Show more hashtags` : 'Collapse'}
    </button>
    {/if}
    <button class="common-btn-sm-ghost" type="button" on:click={() => showSearchBar = !showSearchBar}>
      <span>{!showSearchBar ? `Search hashtags` : 'Collapse search'}</span>
      <span><SearchIcon size={16} /></span>
    </button>
    {#if showSearchBar}
    <SearchBar searchKind={"hashtag"} />
    {/if}
  </div>
    {/if}
  </div>
  <hr/>
  {#each eventList as event}
    <div class="common-container-content">
      <ProfileCardCompact userPub={event.author.npub} />
      <div>
        <h3>{event.tagValue("title")}</h3>
        <span class="text-sm" class:hidden={!event.tagValue("summary")}>{event.tagValue("summary")}</span>

        <div class="flex flex-col gap-2 pt-2">
        {#each findListTags(event.tags) as { url, text }}
          {#if url.startsWith("nostr:")}
          <a
            href={`${outNostrLinksUrl}/${url.split(":")[url.split(":").length - 1]}`}
            target="_blank"
            rel="noreferrer"
          >
          <button class="btn variant-filled w-full whitespace-pre-wrap">{text}</button>
          </a>
        {:else}
          <a href={url} target="_blank" rel="noreferrer">
            <button class="btn variant-filled w-full whitespace-pre-wrap">{text}</button>
          </a>
        {/if}
        {/each}
      </div>
        {#each findOtherTags(event.tags, "a") as label}
          <button class="common-btn-icon-ghost" on:click={() => (showForkInfo = !showForkInfo)}>
            {#if !showForkInfo}
              <ForkIcon size={20} />
            {:else}
              <CloseIcon size={20} />
            {/if}
          </button>
          <div class:hidden={!showForkInfo}>
            {#each findOtherTags(event.tags, "a") as label}
              <button
                class="common-btn-icon-ghost inline-flex"
                on:click={() => goto(`${$page.url.origin}/a/${naddrEncodeATags(label)}`)}
                ><span>Go to forked list</span> <ForkIcon size={18} /></button
              >
              <h3 class="text-start">Fork info:</h3>
              <h4 class="text-start">Forked from:</h4>
              <ProfileCardCompact userPub={nip19.npubEncode(label.split(":")[1])} />
              <h4 class="text-start">Label:</h4>
              <code class="text-start">{label}</code>
            {/each}
          </div>
        {/each}
      </div>
      <div class=" inline-flex gap-2 flex-wrap items-center justify-center">
        {#each findOtherTags(event.tags, "t") as hashtag}
          <button class="common-badge-soft w-fit" on:click={() => goto (`/explore/${hashtag}`)}>
            <HashtagIconcopy size={16}/>{hashtag}
          </button>
        {/each}
      </div>
      <div>
      <span class="common-badge-glass">{unixToDate(event.created_at)}</span>
    </div>
    </div>
    <hr/>
  {/each}
  {#if eventList.length == 0}
    <PlaceHolderLoading colCount={5} />
  {/if}  
{/await}
{/key}