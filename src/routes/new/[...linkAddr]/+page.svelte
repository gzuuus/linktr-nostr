<script lang="ts">
  import { NDKEvent } from "@nostr-dev-kit/ndk";
  import ndk from "$lib/stores/provider";
  import CreateNewList from "$lib/components/create-new-list.svelte";
  import { ndkUser } from "$lib/stores/user";
  import { nip19 } from "nostr-tools";
  import { findHashTags, findListTags, findOtherTags, sortEventList } from "$lib/utils/helpers";
  import EditIcon from "$lib/elements/icons/edit-icon.svelte";
  import BinIcon from "$lib/elements/icons/bin-icon.svelte";
  import PinIcon from "$lib/elements/icons/pin-icon.svelte";
  import Login from "$lib/components/login.svelte";
  import { kindLinks, succesDeletingToast, succesPublishToast } from "$lib/utils/constants";
  import { generateNanoId } from "$lib/utils/helpers";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import { Accordion, AccordionItem, getToastStore } from "@skeletonlabs/skeleton";

  const toastStore = getToastStore();
  let events: NDKEvent[] = [];
  let fetchedEvents: boolean = false;
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
      $ndk
        .fetchEvents({
          kinds: [kindLinks],
          authors: [userPubDecoded],
          "#l": ["nostree"],
        })
        .then((fetchedEvent) => {
          events = Array.from(fetchedEvent);
          fetchedEvents = true;
          sortEventList(events);
        });
    }
  }

  function handleSubmit(eventToPublish: NDKEvent, toDelete: boolean = false) {
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = kindLinks;
    let title = eventToPublish.tagValue("title");
    let summary = eventToPublish.tagValue("summary");
    ndkEvent.tags = [
      ["title", title!],
      summary ? ["summary", summary] : ["summary", ""],
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
        fetchedEvents = false;
        if (toDelete) {
          deletedEventsIds.push(eventToPublish.tagValue("d")!);
          toastStore.trigger(succesDeletingToast);
        } else {
          toastStore.trigger(succesPublishToast);
        }
          showEvents();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
</script>
<svelte:head>
  <title>Manage lists</title>
  <meta name="description" content="Manage your nostree lists" />
  <meta property="og:title" content="Manage lists"/>
  <meta property="og:description" content="Manage your nostree lists" />
</svelte:head>
    {#if $ndkUser}
      <div class:hidden={showCreateNewList} class="flex flex-col gap-2 flex-wrap">
        <h2>Manage your lists</h2>
        <button class="common-btn-filled" on:click={() => (showCreateNewList = !showCreateNewList)}>Create new list </button>
      </div>
      <div class:hidden={!showCreateNewList} class="flex flex-col gap-2 flex-wrap items-center">
        <button class="common-btn-icon-ghost w-fit" on:click={() => (showCreateNewList = !showCreateNewList)}><CloseIcon size={20} /></button>
        <CreateNewList eventToEdit={null} />
      </div>
    {:else}
      <Login mode="primary" doGoto={false} />
    {/if}

    {#key events.length}
      {#if events.length > 0 && !showCreateNewList}
      <Accordion regionControl="variant-ghost">
        <AccordionItem>
          <svelte:fragment slot="summary">Show your all lists</svelte:fragment>
          <svelte:fragment slot="content">
          {#key fetchedEvents}
              {#each events as event, i}
                {#if !deletedEventsIds.includes(event.tagValue("d") ?? "")}
                  <div class="common-container-content common-ring rounded-container-token p-2">
                    <div class="flex flex-wrap gap-1 justify-center">  
                    {#if !isEditMode}
                        <button
                          class="common-btn-icon-ghost"
                          on:click={() => {
                            isEditMode = true;
                            editIndex = i;
                          }}><EditIcon size={20} /></button
                        >
                      {:else if editIndex == i}
                        <button
                          class="common-btn-icon-ghost"
                          on:click={() => {
                            isEditMode = false;
                          }}><CloseIcon size={20} /></button
                        >
                      {:else}
                        <button
                          class="common-btn-icon-ghost"
                          on:click={() => {
                            isEditMode = true;
                            editIndex = i;
                          }}><EditIcon size={20} /></button
                        >
                      {/if}
                      <button
                        class="common-btn-icon-ghost"
                        class:firstEvent={i == 0}
                        on:click={() => {
                          handleSubmit(event);
                        }}><PinIcon size={20} /></button
                      >
                      <button
                        class="common-btn-icon-ghost hover:variant-filled-error"
                        on:click={() => {
                          handleSubmit(event, true);
                        }}><BinIcon size={20} /></button
                      >
                    </div>
                    <div class:hidden={isEditMode && editIndex == i}>
                      <h3>{event.tagValue("title")}</h3>
                    <div class="flex flex-wrap gap-1 justify-center">
                    {#each findHashTags(event.tags) as { text }}
                    <span class="common-badge-ghost">
                      <HashtagIconcopy size={16}/>{text}
                    </span>
                    {/each}
                    </div>
                  </div>
                    {#if isEditMode && editIndex == i}
                      <CreateNewList eventToEdit={event} doGoto={true} />
                    {/if}
                    <div class:hidden={isEditMode && editIndex != i}>
                    <Accordion regionControl="variant-ghost">
                        <AccordionItem>
                          <svelte:fragment slot="summary">View links</svelte:fragment>
                          <svelte:fragment slot="content">
                          <div class="flex flex-col flex-wrap gap-2">
                            {#each findListTags(event.tags) as { url, text }}
                              <a href={url} target="_blank" rel="noreferrer"><button class="common-list-btn-filled">{text}</button></a>
                            {/each}
                          </div>
                          </svelte:fragment>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  </div>
                {/if}
              {/each}
          {/key}
        </svelte:fragment>
      </AccordionItem>
      </Accordion>
      {/if}
    {/key}
