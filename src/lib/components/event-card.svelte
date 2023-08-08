<script lang="ts">
  export let userPub: string;
  export let eventKind: number;
  import { Kind, nip19 } from "nostr-tools";
  import ndk from "$lib/stores/provider";
  import { unixToDate, buildEventPointer, getTagValue, findListTags} from "$lib/utils/helpers";
  import { Button, Tag } from "agnostic-svelte";
  import LinktOut from "$lib/elements/icons/linkt-out.svelte";
  import ParsedContent from './parse-content.svelte';
  import type { NDKEvent } from "@nostr-dev-kit/ndk";
  import { updateLength } from "$lib/stores/eventListsLengths";
  import ChevronIcon from "$lib/elements/icons/chevron-icon.svelte";

  const linkListEventKind = 30303 as Kind;
  let userPubDecoded: string = nip19.decode(userPub).data.toString();
  let eventList: NDKEvent[] = [];
  
    if (eventKind == linkListEventKind){
      $ndk.fetchEvents({ kinds: [eventKind], authors: [userPubDecoded]}, {closeOnEose: true, groupable: true}).then((fetchedEvent) => {
      eventList = Array.from(fetchedEvent).filter(event => getTagValue(event.tags, 'title') !== '');
      updateLength(linkListEventKind, eventList.length);
    });} else{
      $ndk.fetchEvents({ kinds: [eventKind], authors: [userPubDecoded], limit: 5}, {closeOnEose: false, groupable: true} ).then((fetchedEvent) => {
      eventList = Array.from(fetchedEvent);
      updateLength(eventKind, eventList.length);
    });}

    $: currentIndex = 0;
    function clampIndex(value: number, min: number, max: number) {
      return Math.min(Math.max(value, min), max);
    }
</script>
  
<div class="sectionContainer">
  {#if eventKind == linkListEventKind && eventList.length > 0}
    <div class="eventContentContainer">
      <div class="eventContainerButtons">
        <div> 
        <button class="switchButtons" class:disabled={currentIndex == 0} class:hidden={eventList.length == 1} on:click={() => currentIndex = clampIndex(currentIndex - 1, 0, eventList.length - 1)}><ChevronIcon size={20} /></button>
        <h3>{getTagValue(eventList[currentIndex].tags, "title")}</h3>
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
        {#each findListTags(eventList[currentIndex].tags) as { url, text }}
            <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
        {/each}
    </div>
  {:else}
    {#each eventList as event}
      <div class="eventContainer" >
        <div class="eventContentContainer">
          {#if event.kind === 30023}
            <h3>{getTagValue(event.tags, "title")}</h3>
          {/if}
          {#if event.kind != 30023}
            <ParsedContent content={event.content} />
          {/if}
        </div>
        <div class="infoBox">
            <Tag>{unixToDate(event.created_at)}</Tag>
            <a href="https://nostr.com/{buildEventPointer(event.id, [event.relay?.url ?? ''], event.pubkey, event.kind, event.tags)}" target="_blank" rel="noreferrer"><button class="infoButton"><LinktOut size={20} color=var(--accent-color)/></button></a>
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
