<script lang="ts">
  export let userPub: string;
  export let eventKind: number;
  export let listLabel: string = "nostree";
  export let dValue: string = "";
  export let isEditHappens: boolean = false;
  export let isFork: boolean = false;
  export let linkListLength: number;
  
  import { nip19 } from "nostr-tools";
  import ndk from "$lib/stores/provider";
  import {
    unixToDate,
    buildEventPointer,
    findListTags,
    sortEventList,
    findOtherTags,
    naddrEncodeATags,
  } from "$lib/utils/helpers";
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import { kindLinks, toastTimeOut } from "$lib/utils/constants";
  import { page } from "$app/stores";
  import { isNip05Valid as isNip05ValidStore, ndkUser } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  import ChevronIconHorizontal from "$lib/elements/icons/chevron-icon-horizontal.svelte";
  import CreateNewList from "./create-new-list.svelte";
  import EditIcon from "$lib/elements/icons/edit-icon.svelte";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import ForkIcon from "$lib/elements/icons/fork-icon.svelte";
  import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
  import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
  import PublishKind1 from "./publish-kind1.svelte";
    import { outNostrLinksUrl } from "../utils/constants";
    import ClipboardButton from "./clipboardButton.svelte";
    import PlaceHolderLoading from "./placeHolderLoading.svelte";

  let userPubDecoded: string = nip19.decode(userPub).data.toString();
  let eventList: NDKEvent[] = [];
  let showDialog: boolean = false;
  let showListsIndex: boolean = false;
  let showListsIndexSwitchTabs: boolean = false;
  let showForkInfo: boolean = false;
  let isEditMode: boolean = false;
  let isFormSent: boolean = false;
  let isKink1Published: boolean = false;
  let eventTitles: string[] = [];
  let eventHashtags: string[] = [];
  let showShareModal:boolean = false;
  const ndkFilter: NDKFilter = dValue
    ? { kinds: [eventKind], authors: [userPubDecoded], "#d": [`${dValue}`] }
    : { kinds: [eventKind], authors: [userPubDecoded], "#l": [`${listLabel}`] };

  async function fetchCurrentEvents() {
    if (eventKind == kindLinks) {
      $ndk
        .fetchEvents(ndkFilter, {
          closeOnEose: false,
          cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
        })
        .then((fetchedEvent) => {
          eventList = Array.from(fetchedEvent);
          linkListLength = eventList.length;

          sortEventList(eventList);
          eventList.forEach((event) => {
            event.tags.forEach((tag) => {
              if (tag[0] == "title") eventTitles.push(tag[1]);
              if (tag[0] == "t" ) eventHashtags.push(tag[1]); 
            });
          });
        });
    } else {
      const ndkFilter: NDKFilter = dValue
        ? { kinds: [eventKind], authors: [userPubDecoded], "#d": [`${dValue}`], limit: 5 }
        : { kinds: [eventKind], authors: [userPubDecoded], limit: 5 };
      $ndk.fetchEvents(ndkFilter, { closeOnEose: true, groupable: true }).then((fetchedEvent) => {
        eventList = Array.from(fetchedEvent);
        sortEventList(eventList);
      });
    }
  }

  $: currentIndex = 0;
  function clampIndex(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  $: {
    if (isFormSent) {
      isEditMode = false;
      isEditHappens = !isEditHappens;
    }
    if (isKink1Published) {
      showShareModal = false
      setTimeout(() => {
        isKink1Published = false     
      }, toastTimeOut)
    }
  }
</script>
<!-- <Toasts portalRootSelector="body" horizontalPosition="center" verticalPosition="top">
  <Toast isOpen={isShared} type="success">
    <p>Copied to clipboard</p>
  </Toast>
  <Toast isOpen={isKink1Published} type="success">
    <p>Note published</p>
  </Toast>
</Toasts> -->
{#await fetchCurrentEvents()}
<PlaceHolderLoading colCount={6} />
{:then value}
    {#if eventList.length > 0}
        <div>
          <div class:justify-between={eventList.length > 1} class="flex justify-center">
            <button
              class:disabled={currentIndex === 0}
              class:hidden={eventList.length === 1 || isEditMode}
              on:click={() => (currentIndex = clampIndex(currentIndex - 1, 0, eventList.length - 1))}
            >
            <span class="common-badge-ghost">
              <ChevronIconHorizontal size={16} flipHorizontal={true} />
                {currentIndex + 1}</span
              >
            </button>

            <h3 class:hidden={isEditMode}>
              {eventList[currentIndex].tagValue("title")}
            </h3>

            <button
              class:disabled={currentIndex == eventList.length - 1}
              class:hidden={eventList.length == 1 || isEditMode}
              on:click={() => (currentIndex = clampIndex(currentIndex + 1, 0, eventList.length - 1))}
            >
              <span class="common-badge-ghost">
                {eventList.length + 1 - (currentIndex + 1)}
                <ChevronIconHorizontal size={16} /></span>
            </button>
          </div>
          <span class="text-sm" class:hidden={isEditMode || !eventList[currentIndex].tagValue("summary")}>
            {eventList[currentIndex].tagValue("summary")}
          </span>
          <div class:hidden={isEditMode}>
            <button on:click={() => (showListsIndex = !showListsIndex)}>
              {#if !showListsIndex}
                <ChevronIconVertical size={22} flipVertical={true} />
              {:else}
                <ChevronIconVertical size={22} flipVertical={false} />
              {/if}
            </button>
          </div>

          {#if showListsIndex && !isEditMode}
          <hr class="!border-t-2" />
          <div class="common-container-content justify-center py-2">
            {#each findOtherTags(eventList[currentIndex].tags, "l") as label}
              {#if label !== "nostree"}
              <div class="inline-flex gap-2 justify-center flex-wrap">
                {#each findOtherTags(eventList[currentIndex].tags, "t") as hashtag}
                <button on:click={() => goto (`/explore/${hashtag}`)}><span class="common-badge-filled"><HashtagIconcopy size={16}/>{hashtag}</span></button>
                {/each}
                </div>
                  <div>
                    <div
                      class:hidden={!showListsIndex}
                      class="flex gap-2 items-center justify-center"
                    >
                      {#if $ndkUser}
                        <div>
                          {#if eventList[currentIndex].author.npub != $ndkUser?.npub}
                            <button
                              class="btn btn-sm variant-ghost"
                              on:click={() => {
                                isEditMode = !isEditMode;
                                isFork = true;
                              }}><ForkIcon size={16} /></button
                            >
                          {:else}
                            <button
                              class="btn btn-sm variant-ghost"
                              on:click={() => {
                                isEditMode = !isEditMode;
                                isFork = false;
                              }}><EditIcon size={16} /></button
                            >
                          {/if}
                        </div>
                      {/if}
                          <ClipboardButton buttonIcon="link" contentToCopy={`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`} />
                          <ClipboardButton buttonIcon="id" contentToCopy={`${$page.url.origin}/a/${buildEventPointer(
                            undefined,
                            [],
                            userPubDecoded,
                            eventList[currentIndex].kind,
                            eventList[currentIndex].tagValue("d")
                          )}`}/>
                    </div>
                  </div>
                  <button
                  class="common-btn-sm-ghost"
                  on:click={() => showShareModal = true }><ShareIcon size={18}/> Share on nostr!
                  </button>
                  {#if showShareModal && !isKink1Published}
                  <div class="modal">
                    <div class="modal-content">
                      <PublishKind1 
                      listTitle={eventList[currentIndex].tagValue("title")} 
                      listURL={`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`}
                      bind:isPublished={isKink1Published}
                      />
                      <div class="closeModal">
                        <button type="button" class="iconButton" on:click={() => (showShareModal = false)}><CloseIcon size={18} /></button>
                      </div>
                    </div>
                  </div>
                  {/if}
                {/if}
              {/each}
              <hr/>
              <!-- <div class=" inline-flex gap-2 justify-center">
                <button
                  class="btn btn-sm variant-outline"
                  class:selected={!showListsIndexSwitchTabs}
                  on:click={() => (showListsIndexSwitchTabs = !showListsIndexSwitchTabs)}>Lists</button
                >
                <button
                  class="btn btn-sm variant-outline"
                  class:selected={showListsIndexSwitchTabs}
                  on:click={() => (showListsIndexSwitchTabs = !showListsIndexSwitchTabs)}>Slugs</button
                >
              </div> -->
            
              <div class="flex flex-col gap-2 items-center">
                {#each eventTitles as title, index}
                  <button
                    class:hidden={showListsIndexSwitchTabs}
                    class="{currentIndex == index ? "btn btn-sm variant-ghost-primary w-fit" : "btn btn-sm variant-ghost w-fit"}"
                    on:click={() => {
                      currentIndex = index;
                      showListsIndex = !showListsIndex;
                    }}>{index + 1}.{title}</button
                  >
                {/each}
                <!-- {#each eventSlugs as slug}
                  <button
                    class="btn btn-sm variant-ghost"
                    class:hidden={!showListsIndexSwitchTabs}
                    on:click={() => {
                      goto(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${slug}`);
                    }}>{slug}</button
                  >
                {/each} -->
                <span class="common-badge-filled">{unixToDate(eventList[currentIndex].created_at)}</span>
              </div>
              <hr class="!border-t-2" />
            </div>
          {/if}
        </div>
        <div class="common-container-content">
        <div>
          {#if !isEditMode}
          <div class="flex flex-col gap-2">
            {#if eventList.length > 1}

                {#each findListTags(eventList[currentIndex].tags) as { url, text }}
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
            {:else}
                {#each findListTags(eventList[currentIndex].tags) as { url, text }}
                  <a href={url} target="_blank" rel="noreferrer">
                    <button class="btn variant-filled w-full">{text}</button>
                  </a>
                {/each}

            {/if}
          </div>
          {:else}
            <button class="common-btn-sm-ghost"
              on:click={() => {
                isEditMode = false;
                showDialog = false;
              }}>{isFork ? "Forking" : "Editing"} <CloseIcon size={16} /></button
            >
            <CreateNewList bind:isFormSent eventToEdit={eventList[currentIndex]} doGoto={isFork ? true : false} />
          {/if}
        </div>
        <div class="inline-flex justify-center">
          {#each findOtherTags(eventList[currentIndex].tags, "l") as label}
            {#if label !== "nostree" && !label.startsWith(userPub.slice(-3))}
              <button
                class="common-btn-sm-ghost"
                on:click={() => goto(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`)}
                ><code>{label}</code></button
              >
            {/if}
          {/each}
          {#each findOtherTags(eventList[currentIndex].tags, "a") as label}
            <button class="common-btn-sm-ghost" on:click={() => (showForkInfo = !showForkInfo)}>
              {#if !showForkInfo}
                <ForkIcon size={20} />
              {:else}
                <CloseIcon size={20} />
              {/if}
            </button>
          {/each}
        </div>
        <div class:hidden={!showForkInfo}>
          {#each findOtherTags(eventList[currentIndex].tags, "a") as label}
            <button
              class="inline-flex"
              on:click={() => goto(`${$page.url.origin}/a/${naddrEncodeATags(label)}`)}
              ><span>Go to forked list</span> <ForkIcon size={18} /></button
            >
            <h3 class="text-left">Fork info:</h3>
            <h4 class="text-left">Forked from:</h4>
            <ProfileCardCompact userPub={nip19.npubEncode(label.split(":")[1])} />
            <h4 class="text-left">Label:</h4>
            <code class="text-left">{label}</code>
          {/each}
        </div>
        </div>
    <!-- {:else}
    {#each eventList as event}
        <div class="eventContainer">
          <div class="eventContentContainer">
            {#if event.kind === 30023}
              <h3>{event.tagValue("title")}</h3>
              {#if showSummary}
                <p>{event.tagValue("summary")}</p>
              {/if}
            {/if}
            {#if event.kind != 30023}
              <ParsedContent content={event.content} />
            {/if}
          </div>
          <div class="infoBox">
            {unixToDate(event.created_at)}
            <a
              href="{outNostrLinksUrl}/{buildEventPointer(
                event.id,
                [event.relay?.url ?? ''],
                event.pubkey,
                event.kind,
                event.tagValue('d')
              )}"
              target="_blank"
              rel="noreferrer"><button class="infoButton"><LinkOut size={20} color="var(--accent-color)" /></button></a
            >
          </div>
        </div>
      {/each} -->
    {/if}
{/await}
<!-- 
<style>
  .listLinkOutSection {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  /* .overlayButton {
    position: absolute;
    right: 0.3em;
    border: var(--common-border-style);
  } */
  button.switchButtons.commonPadding {
    margin-top: 0.3em;
  }
  button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .infoButton {
    margin: 0;
    display: flex;
    background: transparent;
    border: none;
    transition: all 0.2s ease-in-out;
  }
  .eventContentContainer {
    margin: 0.3em 0;
    word-wrap: break-word;
    overflow: hidden;
  }
  .sectionContainer {
    overflow: auto;
  }
  .indexDotButtonContainer {
    max-width: 100%;
  }
  @media screen and (max-width: 350px) {
    .indexDotButtonContainer {
      overflow: scroll !important;
    }
  }
  .switchButtons {
    padding: 0;
    margin: 0;
    display: inline-flex;
  }
  .eventContainerButtons {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 0.3em;
    width: 100%;
    position: relative;
  }
  .listLinkOutContainer {
    gap: 0.5em;
  }
  .listLinkOutContainerContent {
    display: flex;
    gap: 0.5em;
    align-items: baseline;
  }
  .eventContainerButtons > div {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }
  .infoBox {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--accent-color);
    padding-top: 0.1em;
    gap: 0.5em;
  }
  .listsIndexSection {
    flex-direction: column;
    margin-top: 0.5em;
    gap: 0 !important;
  }
</style> -->
