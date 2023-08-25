<script lang="ts">
  export let userPub: string;
  export let eventKind: number;
  export let listLabel: string = 'nostree';
  export let dValue: string = '';
  export let showSummary: boolean = false;
  export let isEditHappens: boolean = false;
  
  import { nip19 } from "nostr-tools";
  import ndk from "$lib/stores/provider";
  import { unixToDate, buildEventPointer, getTagValue, findListTags, sortEventList, findOtherTags, sharePage, truncateString, naddrEncodeATags } from "$lib/utils/helpers";
  import { Button, Tag } from "agnostic-svelte";
  import ParsedContent from './parse-content.svelte';
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import { updateLength } from "$lib/stores/eventListsLengths";
  import { pannable, handlePanStart, handlePanMove, initializeCoords,coords } from '$lib/utils/pannable';
  import { kindLinks } from '$lib/utils/constants';
  import { page } from "$app/stores";
  import { isNip05Valid as isNip05ValidStore, ndkUser } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  import OstrichIcon from "$lib/elements/icons/ostrich-icon.svelte";
  import InfoDialog from "./info-dialog.svelte";
  import OpenDrawerIcon from "$lib/elements/icons/open-drawer-icon.svelte";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
  import ChevronIcon from "$lib/elements/icons/chevron-icon.svelte";
  import LinktOut from "$lib/elements/icons/linkt-out.svelte"; 
  import CreateNewList from "./create-new-list.svelte";
  import EditIcon from "$lib/elements/icons/edit-icon.svelte";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import ForkIcon from "$lib/elements/icons/fork-icon.svelte";

  let userPubDecoded: string = nip19.decode(userPub).data.toString();
  let eventList: NDKEvent[] = [];
  let showDialog: boolean = false;
  let userIdentifier: string | undefined = userPub
  let isSharePossible:boolean= typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function';
  let isEditMode: boolean = false
  let isFormSent: boolean = false
  $:{
    if ($isNip05ValidStore.isNip05Valid){
    userIdentifier=$isNip05ValidStore.Nip05address
  } else {
    userIdentifier=userPub
  }
  }

  if (eventKind == kindLinks) {
    const ndkFilter: NDKFilter = dValue ? { kinds: [eventKind], authors: [userPubDecoded], '#d': [`${dValue}`]} : { kinds: [eventKind], authors: [userPubDecoded], '#l': [`${listLabel}`]}
    $ndk.fetchEvents(ndkFilter, { closeOnEose: true }).then((fetchedEvent) => {
      eventList = Array.from(fetchedEvent);
      updateLength(kindLinks, eventList.length);
      sortEventList(eventList);
    });
  } else {
    const ndkFilter: NDKFilter = dValue ? { kinds: [eventKind], authors: [userPubDecoded], '#d': [`${dValue}`], limit:5} : { kinds: [eventKind], authors: [userPubDecoded], limit:5}
    $ndk.fetchEvents(ndkFilter, { closeOnEose: true, groupable: true }).then((fetchedEvent) => {
      eventList = Array.from(fetchedEvent);

      updateLength(eventKind, eventList.length);
      sortEventList(eventList);
    });
  }

  $: currentIndex = 0;
  function clampIndex(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
  
  let actionExecuted = false; 

  $: {
    if ($coords.x >= 50 && !actionExecuted) {
      currentIndex = clampIndex(currentIndex - 1, 0, eventList.length - 1);
      actionExecuted = true;
    } else if ($coords.x <= -50 && !actionExecuted) {
      currentIndex = clampIndex(currentIndex + 1, 0, eventList.length - 1);
      actionExecuted = true; 
    } else if ($coords.x > -50 && $coords.x < 50) {
      actionExecuted = false;
    }
  }
  $:{
    if (isFormSent) {
      isEditMode = false
      isEditHappens = !isEditHappens
    }
  }
</script>
<div class="sectionContainer">
  {#if eventKind == kindLinks && eventList.length > 0}
    <div class="eventContentContainer">
      <div class="eventContainerButtons">
        <div class:full-width={eventList.length > 1} class:space-between={eventList.length > 1}> 
          <button class="switchButtons" class:disabled={currentIndex == 0} class:hidden={eventList.length == 1 || isEditMode} on:click={() => currentIndex = clampIndex(currentIndex - 1, 0, eventList.length - 1)}><ChevronIcon size={20} /></button>
          <h3 class:hidden={isEditMode}>{getTagValue(eventList[currentIndex].tags, "title")}</h3>
          {#each findOtherTags(eventList[currentIndex].tags, 'l') as label}
            {#if label !== 'nostree'}
              <div class="listLinkOutContainer" class:hidden={isEditMode} style="{showDialog ? 'top: 0' : 'bottom: 0'}; padding: {showDialog ? '0.5em 1.5em;' : '0.1em'}; opacity: {showDialog ? '1' : '0.6'}; ">
                <button class="switchButtons noBorder" on:click={() => showDialog = !showDialog}>
                  {#if !showDialog}
                  <OpenDrawerIcon size={16} flip={false}/>
                  {:else}
                  <OpenDrawerIcon size={20} flip={true}/>
                  {/if}
                </button>
                <div class:hidden={!showDialog} class="no-line-height listLinkOutContainerContent">
                  {#if $ndkUser}
                    <div class="listLinkOutSection">
                      {#if eventList[currentIndex].author.npub != $ndkUser?.npub}
                      <code>Fork</code>
                      <button class="iconButton" on:click={() => isEditMode = !isEditMode}><ForkIcon size={16}/></button>
                      {:else}
                      <code>Edit</code>
                      <button class="iconButton" on:click={() => isEditMode = !isEditMode}><EditIcon size={16} /></button>
                      {/if}
                    </div>
                  {/if}
                  <hr>
                  <div class="listLinkOutSection">
                    <InfoDialog whatInfo="list-slug-share" buttonText="slug" showInfoIcon={true} InfoIconSize={12}/>
                    <a href={`${$page.url.origin}/${userIdentifier}/${label}`} target="_blank" rel="noreferrer"><button class="switchButtons noBorder"><LinktOut size={16}/></button></a>
                    <button class="noButton" class:hidden={!isSharePossible} on:click={() =>sharePage(`${$page.url.origin}/${userIdentifier}/${label}`)}><ShareIcon size={16} /></button>
                  </div>
                  <hr>
                  <div class="listLinkOutSection">
                    <InfoDialog whatInfo="list-naddr-share" buttonText="naddr" showInfoIcon={true} InfoIconSize={12}/>
                      <a href={`${$page.url.origin}/a/${buildEventPointer(
                      undefined,
                      [], 
                      userPubDecoded, 
                      eventList[currentIndex].kind,getTagValue(eventList[currentIndex].tags, 'd')
                      )}`
                    } target="_blank" rel="noreferrer">
                    <button class="switchButtons noBorder"><LinktOut size={16}/></button>
                    </a>
                    <button class="noButton" class:hidden={!isSharePossible} on:click={() =>sharePage(`${$page.url.origin}/a/${buildEventPointer(undefined, [], userPubDecoded, eventList[currentIndex].kind,getTagValue(eventList[currentIndex].tags, 'd'))}`)}><ShareIcon size={16} /></button>
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        <button class="switchButtons" class:disabled={currentIndex == eventList.length - 1} class:hidden={eventList.length == 1 || isEditMode} on:click={() => currentIndex = clampIndex(currentIndex + 1, 0, eventList.length - 1)}><ChevronIcon size={20} flip={false}/></button>
        </div>
        <div class:hidden={eventList.length <= 1 || isEditMode} class="indexDotButtonContainer" style="{eventList.length <= 12 ? 'overflow: hidden' : 'overflow: scroll'};">
            {#each eventList as event, index}
                {#if index == currentIndex}
                  <button class="indexDotButton" on:click={() => currentIndex = index}></button>
                  {:else}
                  <button class="indexDotButton inactive"  on:click={() => currentIndex = index}></button>
                {/if}
            {/each}
        </div>
      </div>
      <div>
        {#if !isEditMode}
        {#if eventList.length > 1}
          <div
            use:pannable
            on:panstart={handlePanStart}
            on:panmove={handlePanMove}
            on:panend={() => initializeCoords()}
            style="transform: translateX({$coords.x}px);"
          >
            {#each findListTags(eventList[currentIndex].tags) as { url, text }}
              {#if url.startsWith('nostr:')}
              <a href={`https://nostr.com/${url.split(':')[url.split(':').length - 1]}`} target="_blank" rel="noreferrer">
                <Button isBlock>{text}
                  <button class="overlayButton commonPadding"><a href={url} rel="noreferrer"><OstrichIcon size={16}/></a></button>
                </Button>
              </a>
              
              {:else}
              <a href={url} target="_blank" rel="noreferrer">
                <Button isBlock>{text}</Button>
              </a>
              {/if}
            {/each}
          </div>
        {:else}
          <div>
            {#each findListTags(eventList[currentIndex].tags) as { url, text }}
              <a href={url} target="_blank" rel="noreferrer">
                <Button isBlock>{text}</Button>
              </a>
            {/each}
          </div>
        {/if}
        {:else}
        <button on:click={() => isEditMode = false}>Editing <CloseIcon size={16} /></button>
        <CreateNewList bind:isFormSent={isFormSent} eventToEdit={eventList[currentIndex]} doGoto={false}/>
        {/if}
      </div>
      <div class="inline-span">
        {#each findOtherTags(eventList[currentIndex].tags, 'l') as label}
          {#if label !== 'nostree' && !label.startsWith(userPub.slice(-3))}
            <button class="switchButtons commonPadding" on:click={() => goto(`${$page.url.origin}/${userIdentifier}/${label}`)}><code>{label}</code></button>
          {/if}
        {/each}
        {#each findOtherTags(eventList[currentIndex].tags, 'a') as label}
          <button class="switchButtons commonPadding" on:click={() => goto(`${$page.url.origin}/a/${naddrEncodeATags(label)}`)}><ForkIcon size={20} /></button>
        {/each}
      </div>
      </div>
  {:else}
    {#each eventList as event}
      <div class="eventContainer" >
        <div class="eventContentContainer">
          {#if event.kind === 30023}
            <h3>{getTagValue(event.tags, "title")}</h3>
            {#if showSummary}
            <p>{getTagValue(event.tags, "summary")}</p>
            {/if}
          {/if}
          {#if event.kind != 30023}
            <ParsedContent content={event.content} />
          {/if}
        </div>
        <div class="infoBox">
            <Tag>{unixToDate(event.created_at)}</Tag>
            <a href="https://nostr.com/{buildEventPointer(event.id, [event.relay?.url ?? ''], event.pubkey, event.kind, getTagValue(event.tags, 'd'))}" target="_blank" rel="noreferrer"><button class="infoButton"><LinktOut size={20} color=var(--accent-color)/></button></a>
          </div>
      </div>
    {/each}
{/if}
</div>
  
<style>
  .listLinkOutSection {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
  }
  .overlayButton {
    position: absolute;
    right: 0.3em;
    border: var(--common-border-style);
  }
  button.switchButtons.commonPadding{
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
.indexDotButton {
  padding: 0.2em;
  border: 0.4em solid var(--background-color);
  margin: 0.2em 0;
}
.indexDotButton:hover {
  background-color: var(--hover-color);
}
.indexDotButtonContainer {
	max-width: 100%;
}
@media screen and (max-width: 350px) {
  .indexDotButtonContainer {
      overflow: scroll !important;
  }
}
.inactive{
  opacity: 0.5;
}
.switchButtons {
  padding: 0;
  margin: 0;
  display: inline-flex;
}
.eventContainerButtons {
	display: flex;
	align-items: center;
	justify-content: center;
  flex-direction: column;
  margin-bottom: 0.3em;
  width: 100%;
  justify-content: space-between;
  position: relative;
}
.listLinkOutContainer {
	position: absolute;
	right: 0;
	bottom: 0;
  display: inline-flex;
  align-items: center;
  border: var(--common-border-style);
  border-radius: var(--agnostic-radius);
  z-index: 9999;
  background: var(--background-color);
  gap: 0.5em;
  height: fit-content;
}
.listLinkOutContainer:hover {
  opacity: 1 !important;
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
</style>
