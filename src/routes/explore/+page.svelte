<script lang="ts">
import type { Kind } from "nostr-tools";
import ndk from "$lib/stores/provider";
import { unixToDate, getTagValue, findListTags, sortEventList } from "$lib/utils/helpers";
import { Button, Tag } from "agnostic-svelte";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import ProfileCardCompact from "$lib/components/profile-card-compact.svelte";
    import ExploreIcon from "$lib/elements/icons/explore-icon.svelte";

  const linkListEventKind = 30303 as Kind
  let eventList: NDKEvent[] = [];
  const sub = $ndk.subscribe({ kinds: [linkListEventKind]});
      sub.on("event", (event: NDKEvent) => {
        if (getTagValue(event.tags, 'title') !== '') {
            eventList = [...eventList, event];
            sortEventList(eventList);
        }
      });
      sub.on("eose", () => {
        console.log("eose");
      });
    
      sub.on("notice", (notice: string) => {
        console.log(notice);
      });

</script>
<div class="commonContainerStyle">
    <h1><ExploreIcon size={25}/>Explore</h1>
    {#each eventList as event}
      <div class="eventContainer" >
            <ProfileCardCompact userPub={event.author.npub} />
        <div class="eventContentContainer">
            <h3>{getTagValue(event.tags, "title")}</h3>
            {#each findListTags(event.tags) as { url, text }}
            <a href="{url}" target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
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