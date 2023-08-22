<script lang="ts">
  export let userPub: string;
  export let eventKind: number;
  export let listLabel: string = 'nostree';
  export let dValue: string = '';
  export let showSummary: boolean = false;
  import { nip19 } from "nostr-tools";
  import ndk from "$lib/stores/provider";
  import { unixToDate, buildEventPointer, getTagValue, findListTags, sortEventList, findOtherTags, copyToClipboard, sharePage } from "$lib/utils/helpers";
  import { Button, Tag } from "agnostic-svelte";
  import LinktOut from "$lib/elements/icons/linkt-out.svelte";
  import ParsedContent from './parse-content.svelte';
  import type { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
  import { updateLength } from "$lib/stores/eventListsLengths";
  import ChevronIcon from "$lib/elements/icons/chevron-icon.svelte";  
  import { pannable, handlePanStart, handlePanMove, initializeCoords,coords } from '$lib/utils/pannable';
  import { kindLinks } from '$lib/utils/constants';
  import { page } from "$app/stores";
    import ThreeDotsIcon from "$lib/elements/icons/three-dots-icon.svelte";
    import ShareIcon from "$lib/elements/icons/share-icon.svelte";
    import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
    import { isNip05Valid as isNip05ValidStore } from "$lib/stores/user";
    import MinusSmall from "$lib/elements/icons/minus-small.svelte";
    import ParseContent from "./parse-content.svelte";
  let userPubDecoded: string = nip19.decode(userPub).data.toString();
  let eventList: NDKEvent[] = [];
  let showDialog: boolean = false;
  let userIdentifier: string | undefined = userPub
  let isSharePossible:boolean= typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function';
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

  // let fetchedEventFromId: NDKEvent | null
  // function fetchEventFromId(id:string){
  //   $ndk.fetchEvent(id).then((fetchedEvent) => {
  //     fetchedEventFromId = fetchedEvent
  //   })
  // }
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
</script>

<div class="sectionContainer">
  {#if eventKind == kindLinks && eventList.length > 0}
    <div class="eventContentContainer">
      <div class="eventContainerButtons">
        <div class:full-width={eventList.length > 1} class:space-between={eventList.length > 1}> 
          <button class="switchButtons" class:disabled={currentIndex == 0} class:hidden={eventList.length == 1} on:click={() => currentIndex = clampIndex(currentIndex - 1, 0, eventList.length - 1)}><ChevronIcon size={20} /></button>
          <h3>{getTagValue(eventList[currentIndex].tags, "title")}</h3>
          {#each findOtherTags(eventList[currentIndex].tags, 'l') as label}
            {#if label !== 'nostree'}
              <div class="listLinkOutContainer">
                <button class="switchButtons noBorder" on:click={() => showDialog = !showDialog}><ThreeDotsIcon size={16} flip={false}/></button>

                <div class:hidden={!showDialog} class="no-line-height">
                  <a href={`${$page.url.origin}/${userIdentifier}/${label}`} target="_blank" rel="noreferrer"><button class="switchButtons noBorder"><LinktOut size={16}/></button></a>
                  <button class="noButton" class:hidden={!isSharePossible} on:click={() =>sharePage(`${$page.url.origin}/${userIdentifier}/${label}`)}><ShareIcon size={16} /></button>
                  <MinusSmall size={16} flip={true}/>
                  <a href={`${$page.url.origin}/a/${buildEventPointer(
                      undefined,
                      [], 
                      userPubDecoded, 
                      eventList[currentIndex].kind,getTagValue(eventList[currentIndex].tags, 'd')
                      )}`
                    } target="_blank" rel="noreferrer">
                    <button class="switchButtons noBorder"><ExploreIcon size={16}/></button>
                  </a>
                  <button class="noButton" class:hidden={!isSharePossible} on:click={() =>sharePage(`${$page.url.origin}/a/${buildEventPointer(undefined, [], userPubDecoded, eventList[currentIndex].kind,getTagValue(eventList[currentIndex].tags, 'd'))}`)}><ShareIcon size={16} /></button>
                </div>
              </div>
            {/if}
          {/each}
        
        <button class="switchButtons" class:disabled={currentIndex == eventList.length - 1} class:hidden={eventList.length == 1} on:click={() => currentIndex = clampIndex(currentIndex + 1, 0, eventList.length - 1)}><ChevronIcon size={20} flip={false}/></button>
        </div>
        <div class:hidden={eventList.length <= 1}>
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
        {#if eventList.length > 1}
          <div
            use:pannable
            on:panstart={handlePanStart}
            on:panmove={handlePanMove}
            on:panend={() => initializeCoords()}
            style="transform: translateX({$coords.x}px);"
          >
            {#each findListTags(eventList[currentIndex].tags) as { url, text }}
              <a href={url} target="_blank" rel="noreferrer">
                <Button isBlock>{text}</Button>
              </a>
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
      </div>      
    </div>
  {:else}
    {#each eventList as event}
      <div class="eventContainer" >
        <div class="eventContentContainer">
          {#if event.kind === 30023}
            <h2>{getTagValue(event.tags, "title")}</h2>
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
  padding: 0.1em;
  z-index: 9999;
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
