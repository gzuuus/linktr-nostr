<script lang="ts">
    export let userPub: string;
    export let eventKind: number;
    import { Kind, nip19, type Event } from "nostr-tools";
    import ndk from "$lib/stores/provider";
    import { unixToDate, buildEventPointer, getTagValue, findListTags} from "$lib/utils/helpers";
    import { utils } from "nostr-tools";
    import { fade } from 'svelte/transition';
    import { Button, Tag } from "agnostic-svelte";
    import LinktOut from "$lib/elements/icons/linkt-out.svelte";
    import ParsedContent from './parse-content.svelte';
    import type { NDKEvent } from "@nostr-dev-kit/ndk";
    import { updateLength } from "$lib/stores/eventListsLengths";
    
    const linkListEventKind = 30303 as Kind;
    let userPubDecoded: string = nip19.decode(userPub).data.toString();
    let eventsList: Event<number>[] = [];
    let linkListEvent: NDKEvent | null;
    
    let relaysList: string[] = Array.from($ndk.pool.relays.keys());
      if (eventKind != linkListEventKind) {
        eventKind = eventKind as Kind;
        const sub = $ndk.subscribe({ kinds: [eventKind], authors: [userPubDecoded], limit: 5 }, { closeOnEose: false });
        sub.on("event", (event: Event) => {
            eventsList = utils.insertEventIntoDescendingList(eventsList, event);
            updateLength(eventKind, eventsList.length);
        });
      
        sub.on("eose", () => {
          console.log("eose");
        });
      
        sub.on("notice", (notice: string) => {
          console.log(notice);
        });
      } else{
        $ndk.fetchEvent({ kinds: [eventKind], authors: [userPubDecoded]}).then((fetchedEvent) => {
          linkListEvent = fetchedEvent;
          if (fetchedEvent) {
            updateLength(eventKind, 1);
          } else {
            updateLength(eventKind, 0);
          }
        });
      }
</script>
  
<div class="sectionContainer">
  {#if eventKind != linkListEventKind}
    {#each eventsList as event}
      <div transition:fade class="eventContainer" >
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
            <a href="https://nostr.com/{buildEventPointer(event.id, [...relaysList], event.pubkey, event.kind, event.tags)}" target="_blank" rel="noreferrer"><button class="infoButton"><LinktOut size={20} color=var(--accent-color)/></button></a>
        </div>

      </div>
    {/each}
  {:else}
    {#if linkListEvent}
      <div class="eventContentContainer">
      <h3>{getTagValue(linkListEvent.tags, "title")}</h3>
      {#each findListTags(linkListEvent.tags) as { url, text }}
        <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
      {/each}
      </div>
    {/if}
  {/if}
</div>
  
<style>

.infoButton {
  margin: 0;
  display: flex;
  background: transparent;
  border: none;
  transition: all 0.2s ease-in-out;
}

.eventContentContainer {
  margin: 0.3em 0;
}

.sectionContainer {
  max-height: 420px;
  overflow: scroll;
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