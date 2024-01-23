<script lang="ts">
  export let userPub: string;
  export let eventKind: number;
  export let listLabel: string = "nostree";
  export let dValue: string = "";
  export let isEditHappens: boolean = false;
  export let isFork: boolean = false;
  export let linkListLength: number | undefined = 0;
  
  import { nip19 } from "nostr-tools";
  import ndk from "$lib/stores/provider";
  import {
    unixToDate,
    buildEventPointer,
    sortEventList,
    findOtherTags,
    naddrEncodeATags,
    filterDbEvents
  } from "$lib/utils/helpers";
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import { kindLinks, oldKindLinks } from "$lib/utils/constants";
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
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
  import PlaceHolderLoading from "./placeHolderLoading.svelte";
  import { getModalStore, getToastStore, type ModalSettings, type ToastSettings } from '@skeletonlabs/skeleton';
  import ClipboardButton from "./clipboard-button.svelte";
  import { onDestroy, onMount } from "svelte";
  import RenderLinks from "./render-links.svelte";
  
  const modalStore = getModalStore();
  const toastStore = getToastStore();
  let eventList: NDKEvent[] = [];
  let RawEventList: NDKEvent[] = [];
  let oldEventList: NDKEvent[] = [];
  let showListsIndex: boolean = false;
  let showListsIndexSwitchTabs: boolean = false;
  let showForkInfo: boolean = false;
  let isEditMode: boolean = false;
  let isFormSent: boolean = false;
  let eventTitles: string[] = [];
  let eventHashtags: string[] = [];
  let userNpub = nip19.npubEncode(userPub);
  const ndkFilter: NDKFilter = dValue
    ? { kinds: [eventKind], authors: [userPub], "#d": [`${dValue}`] }
    : { kinds: [eventKind], authors: [userPub], "#l": [`${listLabel}`] };
  
  export const updateEventToast: ToastSettings = {
    message: 'We are migrating to a new event kind, due a change in the nostr protocol. Please update your events.',
    background: 'variant-filled-warning',
    timeout: 5000,
    hoverable: true,
    classes: 'flex flex-col gap-2',
    action: {
      label: 'Update events',
      response: () => crafUpdateModal()
    }
  };

  async function fetchCurrentEvents() {
    try {
      let filterDb: NDKEvent[] | undefined = await filterDbEvents(ndkFilter);

    if (eventKind == kindLinks || oldKindLinks) {
      let fetchedEvent = filterDb ? filterDb : await $ndk.fetchEvents(
        ndkFilter, 
        {
          closeOnEose: true,
        })
      RawEventList = Array.from(fetchedEvent);
      linkListLength = RawEventList.length ? RawEventList.length : undefined;
      sortEventList(RawEventList);
      for (const event of RawEventList) {
        const tagTitleValue = event.tagValue('title');
        const tagHashtagValue = event.tagValue('t');
        
        if (event.kind == kindLinks) {
          eventList.push(event);
          tagTitleValue != undefined && eventTitles.push(tagTitleValue);
          tagHashtagValue != undefined && eventHashtags.push(tagHashtagValue);
        }

      }
      if (userPub == $ndkUser?.pubkey) {
        oldEventList.length > 0 && (toastStore.trigger(updateEventToast));
      }

    } else {
      const ndkFilter: NDKFilter = dValue
        ? { kinds: [eventKind], authors: [userPub], "#d": [`${dValue}`], limit: 5 }
        : { kinds: [eventKind], authors: [userPub], limit: 5 };
      let fetchedEvent = await $ndk.fetchEvents(
        ndkFilter, 
        { 
          closeOnEose: true, 
          groupable: true 
        })
        eventList = Array.from(fetchedEvent);
        sortEventList(eventList);
    }
  }
  catch (e) {
    console.error('Error',e);
  }
  }

  function craftModal(modalTitle:string | undefined = "", modalContent:string) {
    const modal: ModalSettings = {
      type: 'component',
      title: modalTitle,
      body: `Share this nostree list '${modalTitle}'`,
      component: 'modalPublishKind1',
      meta: {
        noteContent: `Look this cool nostree list '${modalTitle}' from nostr:${$isNip05ValidStore.UserNpub}\n${modalContent}`
      }
    };
    modalStore.trigger(modal);
  }

  function crafUpdateModal() {
    const modal: ModalSettings = {
      type: 'component',
      component: 'modalUpdateOldKind',
      meta: {
        noteContent: oldEventList
      }
    };
    modalStore.trigger(modal);
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
  }

  onMount(() => {
      fetchCurrentEvents();
  });

  onDestroy(() => {
    isEditHappens = false;
  })
</script>
    {#if eventList.length == 0 && linkListLength != undefined}
    <PlaceHolderLoading colCount={5} />
    {/if}
    {#if eventList.length > 0}
        <div >
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
          <span class="text-sm" class:hidden={isEditMode || !eventList[currentIndex].tagValue("description")}>
            {eventList[currentIndex].tagValue("description")}
          </span>
          <div class:hidden={isEditMode || eventKind != kindLinks}>
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
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap justify-center gap-1">
                {#each findOtherTags(eventList[currentIndex].tags, "t") as hashtag}
                <button on:click={() => goto (`/explore/${hashtag}`)}><span class="badge variant-soft hover:variant-filled"><HashtagIconcopy size={16}/>{hashtag}</span></button>
                {/each}
                </div>
              <div>
                {#if $ndkUser}
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
              {/if}
              <ClipboardButton buttonIcon="copy" contentToCopy={`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`} />
              <ClipboardButton buttonIcon="id" contentToCopy={`${$page.url.origin}/a/${buildEventPointer(eventList[currentIndex])}`}/>
              <button
              class="common-btn-sm-ghost gap-1"
              on:click={() => craftModal(eventList[currentIndex].tagValue("title"),`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`)}
              ><ShareIcon size={16}/> Share on nostr!
              </button>
              
            </div>
              </div>
                </div>
                {/if}
              {/each}
              <hr/>
              <div class="flex flex-col gap-2 items-center">
                <p class=" font-bold ">Other lists</p>
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
                <span class="common-badge-glass">{unixToDate(eventList[currentIndex].created_at)}</span>
              </div>
              <hr class="!border-t-2" />
            </div>
          {/if}
        </div>
        <div class="common-container-content">
        <div>
          {#if !isEditMode}
          <div class="flex flex-col gap-2">
                <RenderLinks eventTags={eventList[currentIndex].tags} />
          </div>
          {:else}
            <button class="common-btn-sm-ghost"
              on:click={() => {
                isEditMode = false;
              }}>{isFork ? "Forking" : "Editing"} <CloseIcon size={16} /></button
            >
            <CreateNewList bind:isFormSent eventToEdit={eventList[currentIndex]} doGoto={isFork ? true : false} />
          {/if}
        </div>
        <div class="inline-flex justify-center">
          {#each findOtherTags(eventList[currentIndex].tags, "l") as label}
            {#if label !== "nostree" && !label.startsWith(userNpub.slice(-3)) && label.trim() !== ""}
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
        <div class:hidden={!showForkInfo} class="card p-2">
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

        {/if}
