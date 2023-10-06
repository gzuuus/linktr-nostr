<script lang="ts">
  import ndk from "$lib/stores/provider";
  import { unixToDate, findListTags, sortEventList, findOtherTags, naddrEncodeATags, sharePage } from "$lib/utils/helpers";
  import { Button, Tag } from "agnostic-svelte";
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
  import { kindLinks, toastTimeOut } from "$lib/utils/constants";
  import ForkIcon from "$lib/elements/icons/fork-icon.svelte";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import { nip19 } from "nostr-tools";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import Logo from "$lib/elements/icons/logo.svelte";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
  import { Toasts, Toast } from "agnostic-svelte";
  import SearchWidget from "$lib/components/search-widget.svelte";
  let showForkInfo: boolean = false;
  let ndkFilter: NDKFilter
  let eventHashtags: string[] = [];
  let isSubscribe: boolean = false;
  let eventList: NDKEvent[] = [];
  let isShared:boolean = false;
  let initialHashtagCount: number = 15;
  let showAllHashtags:boolean = false;

  $: {
    ndkFilter = $page.params.hashtagvalue
    ? { kinds: [kindLinks], "#t": [`${$page.params.hashtagvalue}`], "#l": ["nostree"]}
    : { kinds: [kindLinks], "#l": ["nostree"]};
  }

async function fetchEvents(filter: NDKFilter) {
  isSubscribe = true;
  eventHashtags= [];
  await $ndk
        .fetchEvents(ndkFilter, {
          closeOnEose: false,
          cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
          groupable: false,
        })
        .then((fetchedEvent) => {
          eventList = Array.from(fetchedEvent);

          sortEventList(eventList);
          eventList.forEach((event) => {
            event.tags.forEach((tag) => {
              if (tag[0] == "t" && !eventHashtags.includes(tag[1]) ) eventHashtags.push(tag[1]); 
            });
          });
        });
        isSubscribe = false;
}
async function handleShareClick(urlToShare: string) {
    const shared = await sharePage(urlToShare);
    
    if (shared) {
      isShared = true;
      setTimeout(() => {
        isShared = false;
      }, toastTimeOut);
    }
  }

function toggleHashtags() {
    showAllHashtags = !showAllHashtags;
  }
</script>
<Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="top">
  <Toast isOpen={isShared} type="success">
    <p>Copied to clipboard</p>
  </Toast>
</Toasts>
<svelte:head>
  <title>{$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'}</title>
  <meta name="description" content={$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'} />
  <meta property="og:title" content={$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'}/>
  <meta property="og:description" content={$page.params.hashtagvalue ? `Exploring: ${$page.params.hashtagvalue}` : 'Explore'} />
</svelte:head>
{#key $page.url.href}
{#await fetchEvents(ndkFilter)}
<div class="commonContainerStyle">
  <div class="loading-global"><Logo size={50}/></div>
  <h3>Loading...</h3>
  <h2 class:hidden={!$page.params.hashtagvalue}> #{$page.params.hashtagvalue}</h2>
</div>
{:then value } 
<div class="commonContainerStyle">
  <h1><button type="button" class="noButton" on:click={() => goto('/explore')}><ExploreIcon size={25} /></button>Explore</h1>
  <div>
    {#key isSubscribe}
    {#each eventHashtags.slice(0, showAllHashtags ? eventHashtags.length : initialHashtagCount) as eventHashtag }
    <button type="button" class="noButton" on:click={() => goto(`/explore/${eventHashtag}`)}>
      <Tag>
        <HashtagIconcopy size={16} />
        {eventHashtag}
      </Tag>
    </button>
  {/each}
  <div>
    {#if eventHashtags.length > 10}
    <button class="secondary-button inline-span" type="button" on:click={toggleHashtags}>
      {!showAllHashtags ? `Show more hashtags` : 'Collapse'}
    </button>
    {/if}
    <SearchWidget searchHashtag={true} buttonText={"Search hastags"}/>
  </div>
    {/key}
    </div>
  {#if $page.params.hashtagvalue}
  <h2>Exploring: #{$page.params.hashtagvalue} <button class="noButton" on:click={()=> handleShareClick($page.params.hashtagvalue)}><ShareIcon size={16}/></button></h2>
  {/if}

  {#each eventList as event}
    <div class="eventContainer">
      <ProfileCardCompact userPub={event.author.npub} />
      <div class="eventContentContainer">
        <h3>{event.tagValue("title")}</h3>
        <h4 class:hidden={!event.tagValue("summary")}>{event.tagValue("summary")}</h4>
        {#each findListTags(event.tags) as { url, text }}
          <a href={url} target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
        {/each}
        {#each findOtherTags(event.tags, "a") as label}
          <button class="switchButtons commonPadding" on:click={() => (showForkInfo = !showForkInfo)}>
            {#if !showForkInfo}
              <ForkIcon size={20} />
            {:else}
              <CloseIcon size={20} />
            {/if}
          </button>
          <div class:hidden={!showForkInfo} class="commonPadding">
            {#each findOtherTags(event.tags, "a") as label}
              <button
                class="switchButtons commonPadding inline-span"
                on:click={() => goto(`${$page.url.origin}/a/${naddrEncodeATags(label)}`)}
                ><span>Go to forked list</span> <ForkIcon size={18} /></button
              >
              <h3 class="text-align-start">Fork info:</h3>
              <h4 class="text-align-start">Forked from:</h4>
              <ProfileCardCompact userPub={nip19.npubEncode(label.split(":")[1])} />
              <h4 class="text-align-start">Label:</h4>
              <code class="text-align-start">{label}</code>
            {/each}
          </div>
        {/each}
      </div>
      <div>
        {#each findOtherTags(event.tags, "t") as hashtag}
        <button type="button" class="noButton" on:click={() => goto (`/explore/${hashtag}`)}><Tag><HashtagIconcopy size={16}/>{hashtag}</Tag></button>
        {/each}
        </div>
        <hr>
      <div class="infoBox">
        <Tag>{unixToDate(event.created_at)}</Tag>
      </div>
    </div>
  {/each}
</div>
{/await}


{/key}

<style>
  @import '$lib/elements/animations/general-animations.css';
  .eventContentContainer {
    margin: 0.3em 0;
    word-wrap: break-word;
    width: 92%;
    margin: auto;
  }

  .infoBox {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.1em;
    gap: 0.5em;
  }
</style>
