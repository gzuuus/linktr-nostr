<script lang="ts">
  import { NDKEvent } from "@nostr-dev-kit/ndk";
  import ndk from "$lib/stores/provider";
  import CreateNewList from "$lib/components/create-new-list.svelte";
  import { ndkActiveUser } from "$lib/stores/provider";
  import { nip19 } from "nostr-tools";
  import { findHashTags, findListTags, findOtherTags, sortEventList } from "$lib/utils/helpers";
  import EditIcon from "$lib/elements/icons/edit-icon.svelte";
  import BinIcon from "$lib/elements/icons/bin-icon.svelte";
  import PinIcon from "$lib/elements/icons/pin-icon.svelte";
  import Login from "$lib/components/login.svelte";
  import { errorPublishToast, kindLinks, succesDeletingToast, succesPublishToast } from "$lib/utils/constants";
  import { generateNanoId } from "$lib/utils/helpers";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import { Accordion, AccordionItem, getModalStore, getToastStore, popup } from "@skeletonlabs/skeleton";
  import CreateNewListWidget from "$lib/components/create-new-list-widget.svelte";
  
  const toastStore = getToastStore();
  const modalStore = getModalStore();
  let events: NDKEvent[] = [];
  let fetchedEvents: boolean = false;
  let showCreateNewList: boolean = false;
  let deletedEventsIds: string[] = [];
  let isEditMode: boolean = false;
  let editIndex: number;

  $: {
    if ($ndkActiveUser) {
      showEvents();
    }
  }

  async function showEvents() {
    if ($ndkActiveUser) {
      let userPubDecoded: string = nip19.decode($ndkActiveUser.npub).data.toString();
      let fetchedEvent = await $ndk.fetchEvents({
          kinds: [kindLinks],
          authors: [userPubDecoded],
          "#l": ["nostree"],
        })
          events = Array.from(fetchedEvent);
          fetchedEvents = true;
          sortEventList(events);
    }
  }

  async function handleSubmit(eventToPublish: NDKEvent, toDelete: boolean = false) {
    if (!$ndk.signer) return
    modalStore.trigger({ type: 'component', component: 'modalLoading'});
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = kindLinks;
    const title = eventToPublish.tagValue("title");
    const description = eventToPublish.tagValue("summary") ? eventToPublish.tagValue("summary") :  eventToPublish.tagValue("description");
    const nameSpace = eventToPublish.tagValue("L");
    ndkEvent.tags = [
      ["title", title!],
      description ? ["description", description] : ["description", ""],
      ["d", eventToPublish.tagValue("d")!],
      ["L", nameSpace ? nameSpace : "me.nostree.ontology"],
    ];
    let links;
    let labels;
    let hashtags;
    if (toDelete) {
      ndkEvent.kind = eventToPublish.kind;
      ndkEvent.tags = [["d", eventToPublish.tagValue("d")!]];
    }
    if (!toDelete) {
      links = findListTags(eventToPublish.tags).map((tag) => ({
        link: tag.url,
        description: tag.description,
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
        ndkEvent.tags.push(["l", "nostree"], ["l", generateNanoId($ndkActiveUser?.npub)]);
      } else if (labels.length === 1 && eventToPublish.tagValue("l") === "nostree") {
        ndkEvent.tags.push(["l", generateNanoId($ndkActiveUser?.npub)]);
      } else {
        for (const labelData of labels) {
          const { label } = labelData;
          ndkEvent.tags.push(["l", label]);
        }
      }
    }
    try {
      await ndkEvent.publish()
      toDelete && await ndkEvent.delete()
      if (eventToPublish.kind != ndkEvent.kind){
        await eventToPublish.delete()
        deletedEventsIds.push(eventToPublish.tagValue("d")!);
      }
      events = [];
      fetchedEvents = false;
      modalStore.clear();
      if (toDelete) {
        deletedEventsIds.push(eventToPublish.tagValue("d")!);
        toastStore.trigger(succesDeletingToast);
      } else {
        toastStore.trigger(succesPublishToast);
      }
        showEvents();
    } catch (e) {
      modalStore.clear();
      toastStore.trigger(errorPublishToast);
      console.log("Error:", e);
    }
  }
</script>
<svelte:head>
  <title>Manage lists</title>
  <meta name="description" content="Manage your nostree lists" />
  <meta property="og:title" content="Manage lists"/>
  <meta property="og:description" content="Manage your nostree lists" />
</svelte:head>
{#if $ndkActiveUser}
  <div class:hidden={showCreateNewList} class="flex flex-col gap-2 flex-wrap">
    <h2>Manage your lists</h2>
  </div>
  <CreateNewListWidget bind:showCreateNewList={showCreateNewList} />
{:else}
  <Login mode="primary" doGoto={false} />
{/if}
<!-- Other lists -->
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
                    class:!variant-filled={i == 0}
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
                  <CreateNewList eventToEdit={event} doGoto={true} listTemplate={undefined} />
                {/if}
                <div class:hidden={isEditMode && editIndex == i}>
                <Accordion regionControl="variant-ghost">
                    <AccordionItem>
                      <svelte:fragment slot="summary">View links</svelte:fragment>
                      <svelte:fragment slot="content">
                      <div class="flex flex-col flex-wrap gap-2">
                        {#each findListTags(event.tags) as { url, description }}
                          <a href={url} target="_blank" rel="noreferrer"><button class="common-list-btn-filled">{description}</button></a>
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
