<script lang="ts">
import ndk from "$lib/stores/provider";
import { unixToDate, getTagValue, findListTags, sortEventList, findOtherTags, naddrEncodeATags } from "$lib/utils/helpers";
import { Button, Tag } from "agnostic-svelte";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";
import { kindLinks } from "$lib/utils/constants";
import ForkIcon from "$lib/elements/icons/fork-icon.svelte";
import CloseIcon from "$lib/elements/icons/close-icon.svelte";
import { nip19 } from "nostr-tools";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
let showForkInfo: boolean = false;

  let eventList: NDKEvent[] = [];
  const sub = $ndk.subscribe({ kinds: [kindLinks], limit: 50, '#l': ['nostree']}, { closeOnEose: true, groupable: true});
      sub.on("event", (event: NDKEvent) => {
            eventList = [...eventList, event];
            sortEventList(eventList);
      });
      sub.on("eose", () => {
        console.log("eose");
      });
    
      sub.on("notice", (notice: string) => {
        console.log(notice);
      });

</script>
<div class="commonContainerStyle">
    <h1><ExploreIcon size={25}/>Explore (beta)</h1>
    {#each eventList as event}
      <div class="eventContainer" >
            <ProfileCardCompact userPub={event.author.npub} />
        <div class="eventContentContainer">
            <h3>{getTagValue(event.tags, "title")}</h3>
            {#each findListTags(event.tags) as { url, text }}
            <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
            {/each}
            {#each findOtherTags(event.tags, 'a') as label}
            <button class="switchButtons commonPadding" on:click={() => showForkInfo = !showForkInfo}>
              {#if !showForkInfo}
              <ForkIcon size={20} />
              {:else}
              <CloseIcon size={20} />
              {/if}
            </button>  
            <div class:hidden={!showForkInfo} class="commonPadding" >
              {#each findOtherTags(event.tags, 'a') as label}
                 
                <button class="switchButtons commonPadding inline-span" on:click={() => goto(`${$page.url.origin}/a/${naddrEncodeATags(label)}`)}><span>Go to forked list</span> <ForkIcon size={18} /></button>
                <h3 class="text-align-start">Fork info:</h3>
                <h4 class="text-align-start">Fordek from:</h4>
                <ProfileCardCompact userPub={nip19.npubEncode(label.split(':')[1])} />
                <h4 class="text-align-start">Label:</h4>
                <code class="text-align-start">{label}</code>
              {/each}
            </div>
            {/each}
        </div>
        <div class="infoBox">
            <Tag>{unixToDate(event.created_at)}</Tag>
        </div>

      </div>
    {/each}
</div>

  <style>
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