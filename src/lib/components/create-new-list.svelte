<script lang="ts">
  export let isFormSent: boolean = false;
  export let doGoto: boolean = true;
  export let eventToEdit: NDKEvent | null = null;
  export let listTemplate: string = "blank";
  import { NDKEvent } from "@nostr-dev-kit/ndk";
  import ndk from "$lib/stores/provider";
  import ResetIcon from "$lib/elements/icons/reset-icon.svelte";
  import LinkIcon from "$lib/elements/icons/link-icon.svelte";
  import TextIcon from "$lib/elements/icons/text-icon.svelte";
  import BinIcon from "$lib/elements/icons/bin-icon.svelte";
  import { buildATags, findHashTags, findListTags, findOtherTags } from "$lib/utils/helpers";
  import { v4 as uuidv4 } from "uuid";
  import InfoIcon from "$lib/elements/icons/info-icon.svelte";
  import { goto } from "$app/navigation";
  import { ndkUser } from "$lib/stores/user";
  import { kindLinks } from "$lib/utils/constants";
  import { generateNanoId } from "$lib/utils/helpers";
  import SlugIcon from "$lib/elements/icons/slug-icon.svelte";
  import { nip19 } from "nostr-tools";
  import InsertIcon from "$lib/elements/icons/insert-icon.svelte";
  import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
  import { isNip05Valid as isNip05ValidStore } from "$lib/stores/user";
  import { InputChip } from '@skeletonlabs/skeleton';
  import { FormData } from "$lib/classes/list";
	import { getToastStore, Accordion, AccordionItem, focusTrap } from '@skeletonlabs/skeleton';
	import { succesPublishToast, errorPublishToast } from '$lib/utils/constants';
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import { popup } from '@skeletonlabs/skeleton';

  const validPrefixes: string[] = [
    "http://",
    "https://",
    "ftp://",
    "nostr:",
    "mailto:",
    "tel:",
    "file://",
    "data:",
    "ssh://",
    "irc://",
    "magnet:",
  ];
  const toastStore = getToastStore();
  const newDTag = `nostree-${uuidv4()}`;
  let linkValidationStatus: boolean[] = [];
  let linkNameValidationStatus: boolean[] = [];
  let formData = new FormData();

  if (listTemplate != "blank") {
    formData = {
      title: listTemplate,
      summary: `A list about ${listTemplate}`,
      links: [{ link: "", description: "" }],
      labels: [{label: listTemplate }],
      forkData: { forkPubKey: "", forkEventoPointer: "" },
      hashtags: [`${listTemplate}`],
    };
  }

  if (eventToEdit) {
    let title = eventToEdit.tagValue("title");
    let summary = eventToEdit.tagValue("summary");
    const rTags = findListTags(eventToEdit.tags);
    const links = rTags.map((tag) => ({ link: tag.url, description: tag.text }));
    const labels = findOtherTags(eventToEdit.tags, "l").map((tag) => ({ label: tag }));
    const tTags = findHashTags(eventToEdit.tags);
    const hashtags = tTags.map((tag) => tag.text);
    const forkedFrom = eventToEdit.tagValue("p");
    const ForkData = {
      forkedPubkey: forkedFrom,
      forkedEventoPointer: buildATags(
        undefined,
        [],
        eventToEdit.author.hexpubkey(),
        eventToEdit.kind,
        eventToEdit.tagValue("d")
      )![0],
    };

    formData = {
      title: title!,
      summary: summary ? summary : "",
      links: links,
      labels: labels,
      forkData: {
        forkPubKey: ForkData.forkedPubkey!,
        forkEventoPointer: ForkData.forkedEventoPointer,
      },
      hashtags: hashtags,
    };

    validateAllURLs();
    validateAllURLNames();
  }

  let isTitleEmpty = true;
  let titleText = "List Title";

  $: {
    isTitleEmpty = formData.title.trim() === "";
    if (formData.title.trim() === "") {
      titleText = "List Title";
    } else {
      titleText = formData.title;
    }
  }

  function validateAllURLs() {
    linkValidationStatus = formData.links.map((linkData) => {
      const isValidPrefix = validPrefixes.some((prefix) => linkData.link.startsWith(prefix));
      return isValidPrefix;
    });
  }

  function validateAllURLNames() {
    linkNameValidationStatus = formData.links.map((linkData) => linkData.description.trim() !== "");
  }

  $: areAllLinksValid =
    linkValidationStatus.length > 0 &&
    linkValidationStatus.every((status) => status) &&
    linkNameValidationStatus.length > 0 &&
    linkNameValidationStatus.every((status) => status);

  function handleSubmit() {
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = kindLinks;
    if (eventToEdit) {
      ndkEvent.tags = [
        ["title", formData.title],
        ["summary", formData.summary],
        ["d", eventToEdit.tagValue("d")!],
      ];
      for (const labelData of formData.labels) {
        const { label } = labelData;
        ndkEvent.tags.push(["l", encodeURIComponent(label.trim().toLowerCase())]);
      }

      if (formData.forkData && eventToEdit.author.npub == $ndkUser?.npub) {
        if (eventToEdit.tagValue("p") != null && eventToEdit.tagValue("a") != null) {
          ndkEvent.tags.push(["p", eventToEdit.tagValue("p")!]);
          ndkEvent.tags.push(["a", eventToEdit.tagValue("a")!]);
        }
      }
      if (formData.forkData && eventToEdit.author.npub != $ndkUser?.npub) {
        ndkEvent.tags.push(["p", nip19.decode(eventToEdit.author.npub).data.toString()]);
        ndkEvent.tags.push([
          "a",
          buildATags(undefined, [], eventToEdit.author.hexpubkey(), eventToEdit.kind, eventToEdit.tagValue("d"))![0],
        ]);
      }
    } else {
      ndkEvent.tags = [
        ["title", formData.title],
        ["summary", formData.summary],
        ["d", newDTag],
        ["l", "nostree"],
        ["l", formData.labels[0].label ? formData.labels[0].label.toLowerCase() : generateNanoId($ndkUser?.npub)],
      ];
    }
    for (const linkData of formData.links) {
      const { link, description } = linkData;
      ndkEvent.tags.push(["r", link.trim(), description.trim()]);
    }
    for (const hashtag of formData.hashtags) {
      if (hashtag.trim() !== "") {
        ndkEvent.tags.push(["t", hashtag.trim().toLowerCase()]);
      }
  }
    ndkEvent
      .publish()
      .then(() => {
        isFormSent = true;
        toastStore.trigger(succesPublishToast);
      })
      .then(() => {
      if (doGoto) {
          goto(`/${$isNip05ValidStore.UserIdentifier}`);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        toastStore.trigger(errorPublishToast)
      });
  }

  function addLinkField(insertFirstPosition: boolean = true) {
    if (insertFirstPosition) {
      formData.links = [{ link: "", description: "" }, ...formData.links];
    } else {
      formData.links = [...formData.links, { link: "", description: "" }];
    }
    validateAllURLs();
    validateAllURLNames();
  }

  function handleRemoveLink(index: number) {
    formData.links = formData.links.filter((_, i) => i !== index);
    linkValidationStatus.splice(index, 1);
    linkNameValidationStatus.splice(index, 1);
  }

  function handleReset() {
    formData = new FormData();
    linkValidationStatus = [];
    linkNameValidationStatus = [];
    eventToEdit = null;
  }

  function handleMoveLink(index: number, direction: string) {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < formData.links.length) {
      const temp = formData.links[index];
      formData.links[index] = formData.links[newIndex];
      formData.links[newIndex] = temp;
    }
  }

  let focusedIndex = -1;
  function handleFocus(index: number) {
    focusedIndex = index;
  }
  function handleBlur() {
    focusedIndex = -1;
  }
  $: isFormValid = areAllLinksValid && formData.title.trim() != ""
</script>
  <h2>{titleText}
    <!-- <span class="inline-span"><InfoDialog whatInfo="new-list" /></span> -->
  </h2>

  <form use:focusTrap={true} on:submit|preventDefault={handleSubmit}>
    <div class=" flex flex-col gap-2 text-start">
      <label class="label" for="title">
        <span>Title</span>
        <input class="input" type="text" id="title" placeholder="Ex. My links" bind:value={formData.title} />
      </label>
      <label class="label" for="summary">
        Description
        <input class="input" type="text" id="summary" placeholder="Brief description of your list" bind:value={formData.summary} maxlength="120"/>
      </label>
      <label class="label" for="links">
        Links
        {#each formData.links as linkData, index}
        <div class="flex flex-col gap-2 pb-2 rounded-container-token" class:variant-soft-surface={focusedIndex == index}>
          <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">
              <TextIcon size={18} />
            </div>
            <input
              type="text"
              id={`description-${index}`}
              placeholder="Link name"
              bind:value={linkData.description}
              on:input={validateAllURLNames}
            />
          </div>
          <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim cursor-pointer" use:popup={{ event: 'click', target: 'popupPrefix', placement: 'top' }}>
              <LinkIcon size={18} />
            </div>
            <input
              type="text"
              id={`link-${index}`}
              placeholder="URL: https://..."
              bind:value={linkData.link}
              on:input={validateAllURLs}
            />
          </div>
          <div class="card p-4 variant-filled max-w-lg" data-popup="popupSlug">
            <p>Slugs are a memorable way to identify your Nostree lists. It gives you a link to your list like nostree.me/user/SLUG</p>
            <ol class="list card p-4 bg-surface-backdrop-token">
              Allowed prefixes:
              {#each validPrefixes as prefix }
              <li>
                <span class="flex-auto">{prefix}</span>
              </li>
              <hr class=" opacity-50"/>
              {/each}
            </ol>
            <div class="arrow variant-filled" />
          </div>
          <div class="card p-4 variant-filled max-w-lg" data-popup="popupPrefix">
            <ol class="list">
              Allowed prefixes:
              <hr class="!border-t-2" />
              {#each validPrefixes as prefix }
              <li>
                <span class="flex-auto">{prefix}</span>
              </li>
              <hr class=" opacity-50"/>
              {/each}
            </ol>
            <div class="arrow variant-filled" />
          </div>

          {#if !linkValidationStatus[index] && linkData.link.trim()}
            <span class="badge variant-ghost-error flex flex-row gap-1 w-fit m-auto" class:hidden={linkData.link.trim() && linkValidationStatus[index]}>
              <InfoIcon size={18} /> Prefix needed
            </span>
          {/if}

          {#if formData.links.length > 1}
            <div>
              <button
                class="common-btn-icon-ghost"
                type="button"
                on:click={() => handleMoveLink(index, "up")}
                on:focus={() => handleFocus(index - 1)}
                on:blur={handleBlur}><ChevronIconVertical size={18} flipVertical={false} /></button
              >
              <button
                class="common-btn-icon-ghost"
                type="button"
                on:click={() => handleMoveLink(index, "down")}
                on:focus={() => handleFocus(index + 1)}
                on:blur={handleBlur}><ChevronIconVertical size={18} flipVertical={true} /></button
              >
              <button
                type="button"
                class="common-btn-icon-ghost-error"
                on:click={() => {
                  handleRemoveLink(index);
                  validateAllURLs();
                  validateAllURLNames();
                }}><BinIcon size={18} /></button
              >
            </div>
          {/if}
        </div>
      {/each}
      </label>
      <Accordion regionControl=" variant-soft">
        <AccordionItem>
          <svelte:fragment slot="lead"><HashtagIconcopy size={18}/></svelte:fragment>
          <svelte:fragment slot="summary">Slug - Hashtags</svelte:fragment>
          <svelte:fragment slot="content">
      <hr/>
      {#each formData.labels as linkLabel, index}
        {#if linkLabel.label.trim() != "nostree"}
        <label class="label" for={`slug-${index}`}>
          <span class=" inline-flex gap-1">Slug
            <button type="button" 
            use:popup={{ event: 'click', target: 'popupSlug', placement: 'top' }}>
            <InfoIcon size={18} />
            </button>
          </span>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]" >
          <div class="input-group-shim">
            <SlugIcon size={18} />
          </div>
          <input type="text" id={`slug-${index}`} placeholder="short-slug" bind:value={linkLabel.label} maxlength="24" />
        </div>
        </label>
        {/if}
      {/each}
      <label class="label" for="hashtags">
        <span class=" inline-flex gap-1">Hashtags 
          <button type="button" 
          use:popup={{ event: 'click', target: 'popupHashtag', placement: 'top' }}>
          <InfoIcon size={18} />
          </button>
        </span>
      <InputChip bind:value={formData.hashtags} name="chips" placeholder="Enter any value...(press intro)"/>
      <div class="card p-4 variant-filled" data-popup="popupHashtag">
        <p>Hashtags are a way to categorize your nostree list in order to increase discoverability. 💡 Press 'intro' to add hashtags</p>
        <div class="arrow variant-filled" />
      </div>
      </label>
    </svelte:fragment>
  </AccordionItem>
</Accordion>
      <div class="flex flex-col gap-2">
          <div class="btn-group variant-ghost grid grid-cols-[auto_auto]">
            <button 
              type="button" 
              class:opacity-50={!isFormValid}  
              disabled={!isFormValid} 
              on:click={() => addLinkField(true)}
              use:popup={{ event: 'hover', target: 'popupIsertTop', placement: 'top' }}
              >
              <InsertIcon size={18} />
            </button>
            <button 
              type="button" 
              class:opacity-50={!isFormValid}  
              disabled={!isFormValid} on:click={() => addLinkField(false)}
              use:popup={{ event: 'hover', target: 'popupIsertBottom', placement: 'top' }}
              >
              <InsertIcon size={18} flipVertical={true} />
            </button>
          </div>
          <div class="card p-4 variant-filled" data-popup="popupIsertTop">
            <p>Insert link at the top of the list</p>
            <div class="arrow variant-filled" />
          </div>
          <div class="card p-4 variant-filled" data-popup="popupIsertBottom">
            <p>Insert link at the bottom of the list</p>
            <div class="arrow variant-filled" />
          </div>
          <div class="btn-group variant-filled grid grid-cols-[1fr_auto]">
            <button class:opacity-50={!isFormValid}  disabled={!isFormValid} type="submit">Publish</button>
            <button type="button" on:click={handleReset}><ResetIcon size={18} /></button>
          </div>
        </div>
      </div>
</form>
