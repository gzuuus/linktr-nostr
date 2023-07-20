<script lang="ts">
    export let userPub: string;
    import { Kind, nip19 } from "nostr-tools";
  
    import ndk from "$lib/stores/provider";
    import type { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";

    import { Button } from "agnostic-svelte";
    import { fade } from "svelte/transition";
    
    let userPubDecoded: string = nip19.decode(userPub).data.toString();
    let eventsKind1: NDKEvent[] = [];
    let eventsKind23: NDKEvent[] = [];
    let eventsKind30001: NDKEvent[] = [];
    
    const filter30001 = 33888 as Kind
    const sub= $ndk.subscribe({kinds:[filter30001], authors:[userPubDecoded]});

        sub.on("event", (event: NDKEvent) => {
            if (event.kind == 1) {
                eventsKind1 = [...eventsKind1, event];
            } else if (event.kind == 30023) {
                eventsKind23 = [...eventsKind23, event];
            } else if (event.kind == filter30001) {
                eventsKind30001 = [...eventsKind30001, event];
            }
        }) 

        sub.on("eose", () => {
            console.log("eose")
        })

        sub.on("notice", (notice: any) => {
            console.log(notice)
        })

        const findEventTags = (event: NDKTag[], fetchTags: string) => {
            let eventTags = event.filter((tag) => tag[0] === fetchTags);
            let fetchedTags = eventTags.map((tag) => tag[1]);
            return fetchedTags;
        }

        const findListTags = (event: NDKTag[]) => {
            let listTagsList: [string, string][] = [];
            let nameTags: string[] = [];
            let pinTags: string[] = [];

            for (let i = 0; i < event.length; i++) {
                const tag = event[i];
                if (tag[0] === 'headers') {
                nameTags = tag.slice(1);
                } else if (tag[0] === 'pin') {
                pinTags = tag.slice(1);
                }
            }

            const maxLength = Math.max(nameTags.length, pinTags.length);

            for (let i = 1; i < maxLength; i++) {
                const nameTag = nameTags[i];
                const pinTag = pinTags[i];

                listTagsList.push([nameTag, pinTag]);
            }
            return listTagsList;
            };

</script>

    <!-- {#each eventsKind1 as event}
    <div class="eventContainer">
        {event.content}
    </div>
    {/each} -->

    <!-- {#each eventsKind1 as event}
    <div class="eventContainer">
        <h3>{event.content}</h3>
    </div>
    {/each}
    
    {#each eventsKind23 as event}
    <div class="eventContainer">
        <h3>{findEventTags(event.tags, "title")}</h3>
        {findEventTags(event.tags, "summary")}
        <hr>
        {findEventTags(event.tags, "t")}
    </div>
    {/each} -->

    {#each eventsKind30001 as event}
    <div transition:fade class="eventContainer">
        <h3>{findEventTags(event.tags, "d")}</h3>
        <hr>
        <div class="linkContainer">
            {#each findListTags(event.tags) as value}
                <a href="{value[1]}" target="_blank" rel="noopener noreferrer"><Button mode="primary" isRounded isBlock>{value[0]}</Button></a>
            {/each}
        </div>
    </div>
    {/each}
<style>
    .eventContainer {
      margin: 10px;
      border-radius: 15px;
      word-wrap: anywhere;
    }
    .linkContainer {
        display: flex;
        flex-direction: column;
    }
  </style>