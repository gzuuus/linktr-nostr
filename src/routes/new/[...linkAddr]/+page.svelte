<script lang="ts">
  import { NDKEvent } from "@nostr-dev-kit/ndk";
  import ndk from "$lib/stores/provider";
  import CreateNewList from "$lib/components/create-new-list.svelte";
  import { ndkUser } from "$lib/stores/user";
  import { Button, Tag } from "agnostic-svelte";
  import { nip19 } from "nostr-tools";
  import { findHashTags, findListTags, findOtherTags, sortEventList } from "$lib/utils/helpers";
  import EditIcon from "$lib/elements/icons/edit-icon.svelte";
  import { Disclose } from "agnostic-svelte";
  import BinIcon from "$lib/elements/icons/bin-icon.svelte";
  import { Spinner } from "agnostic-svelte";
  import PinIcon from "$lib/elements/icons/pin-icon.svelte";
  import Login from "$lib/components/login.svelte";
  import { kindLinks } from "$lib/utils/constants";
  import { generateNanoId } from "$lib/utils/helpers";
  import RepublishIcon from "$lib/elements/icons/republish-icon.svelte";
  import InfoDialog from "$lib/components/info-dialog.svelte";
  import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";

  let events: NDKEvent[] = [];
  let oldEvents: NDKEvent[] = [];
  let showSpinner: boolean = false;
  let fetchedOldEvents: boolean = false;
  let fetchedMigratedEvents: boolean = false;
  let showCreateNewList: boolean = false;
  let deletedEventsIds: string[] = [];
  let isEditMode: boolean = false;
  let editIndex: number;

  $: {
    if ($ndkUser) {
      showEvents();
    }
  }

  function showEvents() {
    if ($ndkUser) {
      let userPubDecoded: string = nip19.decode($ndkUser.npub).data.toString();
      $ndk.fetchEvents({ kinds: [30303 as number], authors: [userPubDecoded] }).then((fetchedEvent) => {
        oldEvents = Array.from(fetchedEvent).filter((event) => event.tagValue("title"));
        fetchedOldEvents = true;
        sortEventList(events);
      });
      $ndk
        .fetchEvents({
          kinds: [kindLinks],
          authors: [userPubDecoded],
          "#l": ["nostree"],
        })
        .then((fetchedEvent) => {
          events = Array.from(fetchedEvent);
          fetchedMigratedEvents = true;
          sortEventList(events);
        });
    }
  }

  function handleSubmit(eventToPublish: NDKEvent, toDelete: boolean = false) {
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = kindLinks;
    let title = eventToPublish.tagValue("title");
    ndkEvent.tags = [
      ["title", title!],
      ["d", eventToPublish.tagValue("d")!],
    ];
    let links;
    let labels;
    let hashtags;
    if (toDelete) {
      ndkEvent.kind = eventToPublish.kind;
      title = "";
      ndkEvent.tags = [["d", eventToPublish.tagValue("d")!]];
    }
    if (!toDelete) {
      links = findListTags(eventToPublish.tags).map((tag) => ({
        link: tag.url,
        description: tag.text,
      }));
      hashtags = findOtherTags(eventToPublish.tags, "t").map((tag) => ({ hashtag: tag }));
      for (const linkData of links) {
        const { link, description } = linkData;
        ndkEvent.tags.push(["r", link, description]);
      }
      for (const hashtagData of hashtags) {
        const { hashtag } = hashtagData;
        ndkEvent.tags.push(["t", hashtag]);
      }
      labels = findOtherTags(eventToPublish.tags, "l").map((tag) => ({ label: tag }));
      if (labels.length === 0) {
        ndkEvent.tags.push(["l", "nostree"], ["l", generateNanoId($ndkUser?.npub)]);
      } else if (labels.length === 1 && eventToPublish.tagValue("l") === "nostree") {
        ndkEvent.tags.push(["l", generateNanoId($ndkUser?.npub)]);
      } else {
        for (const labelData of labels) {
          const { label } = labelData;
          ndkEvent.tags.push(["l", label]);
        }
      }
    }
    ndkEvent
      .publish()
      .then(() => {
        events = [];
        oldEvents = [];
        fetchedOldEvents = false;
        fetchedMigratedEvents = false;
        showSpinner = false;
        if (toDelete) {
          deletedEventsIds.push(eventToPublish.tagValue("d")!);
        }
        setTimeout(() => {
          showEvents();
        }, 1100);
      })
      .catch((error) => {
        console.log("Error:", error);
        showSpinner = false;
      });
  }
  function checkBetwList(event: NDKEvent): boolean {
    let eventDtag = event.tagValue("d");
    for (const oldEvent of events) {
      const oldEventDtag = oldEvent.tagValue("d");
      if (eventDtag === oldEventDtag && oldEvent.kind != event.kind) {
        return true;
      }
    }
    return false;
  }
</script>
<svelte:head>
  <title>Manage lists</title>
  <meta name="description" content="Manage your nostree lists" />
  <meta property="og:title" content="Manage lists"/>
  <meta property="og:description" content="Manage your nostree lists" />
</svelte:head>
{#if showSpinner}
  <div class="spinnerContainer">
    <Spinner size="xlarge" />
  </div>
{/if}
<div class="listContainer commonContainerStyle">
  <div>
    {#if $ndkUser}
      <div class:hidden={showCreateNewList}>
        <h2>Manage your lists</h2>
        <button class="isBlock" on:click={() => (showCreateNewList = !showCreateNewList)}>Create new list </button>
      </div>
      <div class:hidden={!showCreateNewList}>
        <CreateNewList eventToEdit={undefined} />
      </div>
    {:else}
      <Login mode="primary" doGoto={false} />
    {/if}
    {#key events.length}
      {#if events.length > 0}
        <div class="allListsContainer">
          {#key fetchedMigratedEvents}
            <Disclose isBackground title="All your lists">
              {#each events as event, i}
                {#if !deletedEventsIds.includes(event.tagValue("d") ?? "")}
                  <div class="commonBorderStyle commonPadding">
                    <div class="eventContainer noBorder">
                      {#if !isEditMode}
                        <button
                          class="iconButton"
                          on:click={() => {
                            isEditMode = true;
                            editIndex = i;
                          }}><EditIcon size={20} /></button
                        >
                      {:else if editIndex == i}
                        <button
                          class="iconButton"
                          on:click={() => {
                            isEditMode = false;
                          }}><CloseIcon size={20} /></button
                        >
                      {:else}
                        <button
                          class="iconButton"
                          on:click={() => {
                            isEditMode = true;
                            editIndex = i;
                          }}><EditIcon size={20} /></button
                        >
                      {/if}
                      <button
                        class="iconButton"
                        class:firstEvent={i == 0}
                        on:click={() => {
                          handleSubmit(event);
                          showSpinner = true;
                        }}><PinIcon size={20} /></button
                      >
                      <button
                        class="iconButton"
                        on:click={() => {
                          handleSubmit(event, true);
                          showSpinner = true;
                        }}><BinIcon size={20} /></button
                      >
                      <h3>{event.tagValue("title")}</h3>
                      
                    </div>
                    <div>
                    {#each findHashTags(event.tags) as { text }}
                    <Tag><HashtagIconcopy size={16}/>{text}</Tag>
                    {/each}
                    </div>
                    {#if isEditMode && editIndex == i}
                      <CreateNewList eventToEdit={event} doGoto={true} />
                    {/if}

                    <details class="showLinksDetails">
                      <summary><ChevronIconVertical size={20} flipVertical={true} /></summary>
                      {#each findListTags(event.tags) as { url, text }}
                        <a href={url} target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
                      {/each}
                    </details>
                  </div>
                {/if}
              {/each}
            </Disclose>
          {/key}
        </div>
      {/if}
      {#if oldEvents.length > 0}
        <div class="allListsContainer">
          {#key fetchedOldEvents}
            {#each oldEvents as event, i}
              {#if fetchedMigratedEvents && fetchedOldEvents}
                {#if !checkBetwList(event)}
                  <hr />
                  <div class="alertContainer">
                    <h3>
                      🔺 List in the old format <span class="inline-span"
                        ><InfoDialog whatInfo="list-old-format-migrate" /></span
                      >
                    </h3>
                    <div class="eventContainer">
                      <button
                        class="iconButton"
                        on:click={() => {
                          handleSubmit(event);
                          showSpinner = true;
                        }}><RepublishIcon size={20} /></button
                      >
                      <button
                        class="iconButton"
                        on:click={() => {
                          handleSubmit(event, true);
                          showSpinner = true;
                        }}><BinIcon size={20} /></button
                      >
                      <h3>{event.tagValue("title")}</h3>
                      {#each findListTags(event.tags) as { url, text }}
                        <a href={url} target="_blank" rel="noreferrer"><Button isBlock>{text}</Button></a>
                      {/each}
                    </div>
                  </div>
                {/if}
              {/if}
            {/each}
          {/key}
        </div>
      {/if}
    {/key}
  </div>
</div>

<style>
  button:hover {
    color: var(--hover-color);
  }
  .firstEvent {
    color: var(--hover-color);
  }
  .listContainer {
    display: block;
    word-break: break-word;
  }

  .allListsContainer {
    margin-top: 0.5em;
  }
  .alertContainer {
    opacity: 0.6;
    transition: all 0.2s ease-in-out;
  }
  .alertContainer:hover {
    opacity: 1;
  }
  .eventContainer.noBorder {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 0.5em;
    padding: 0;
    margin: 0 0.5em;
  }
  .showLinksDetails {
    padding: 0.5em;
  }
</style>
