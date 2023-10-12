<script lang="ts">
  export let isFormSent: boolean = false;
  export let doGoto: boolean = true;
  export let eventToEdit: NDKEvent | null = null;
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
  import InfoDialog from "$lib/components/info-dialog.svelte";
  import SlugIcon from "$lib/elements/icons/slug-icon.svelte";
  import { nip19 } from "nostr-tools";
  import InsertIcon from "$lib/elements/icons/insert-icon.svelte";
  import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
  import { isNip05Valid as isNip05ValidStore } from "$lib/stores/user";
  import HashtagIconcopy from "$lib/elements/icons/hashtag-icon copy.svelte";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  import PublishKind1 from "./publish-kind1.svelte";
  import { page } from "$app/stores";

  let showSpinner: boolean = false;
  let publishKind1: boolean = false;
  let isKind1Published:boolean=false
  const newDTag = `nostree-${uuidv4()}`;
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

  let linkValidationStatus: boolean[] = [];
  let linkNameValidationStatus: boolean[] = [];

  let formData = {
    title: "",
    summary: "",
    links: [{ link: "", description: "" }],
    labels: [{ label: "" }],
    forkData: { forkPubKey: "", forkEventoPointer: "" },
    hashtags: [{ hashtags: "" }],
  };

  if (eventToEdit) {
    let title = eventToEdit.tagValue("title");
    let summary = eventToEdit.tagValue("summary");
    const rTags = findListTags(eventToEdit.tags);
    const links = rTags.map((tag) => ({ link: tag.url, description: tag.text }));
    const labels = findOtherTags(eventToEdit.tags, "l").map((tag) => ({ label: tag }));
    const tTags = findHashTags(eventToEdit.tags);
    const hashtags = tTags.map((tag) => ({ hashtags: tag.text }));

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
    showSpinner = true;
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
        ndkEvent.tags.push(["l", encodeURIComponent(label.trim())]);
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
        ["l", formData.labels[0].label ? formData.labels[0].label : generateNanoId($ndkUser?.npub)],
      ];
    }
    for (const linkData of formData.links) {
      const { link, description } = linkData;
      ndkEvent.tags.push(["r", link.trim(), description.trim()]);
    }
    for (const hashTagData of formData.hashtags) {
      const { hashtags } = hashTagData;
      if (hashtags.trim()!== "") {
        ndkEvent.tags.push(["t", hashtags.trim().toLowerCase()]);
      }
    }

    ndkEvent
      .publish()
      .then(() => {
        showSpinner = false;
        isFormSent = true;
        // if (!eventToEdit){
        //   publishKind1 = true;
        // }
      })
      .then(() => {
      if (doGoto) {
          goto(`/${$isNip05ValidStore.UserIdentifier}`);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        showSpinner = false;
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
  function addHashtagField() {
    formData.hashtags = [...formData.hashtags, { hashtags: "" }];
  }

  function removeLinkField(index: number) {
    formData.links = formData.links.filter((_, i) => i !== index);
    linkValidationStatus.splice(index, 1);
    linkNameValidationStatus.splice(index, 1);
  }

  function removeHashTagField(index: number) {
    formData.hashtags = formData.hashtags.filter((_, i) => i !== index);
  }

  function handleReset() {
    formData = {
      title: "",
      summary: "",
      links: [{ link: "", description: "" }],
      labels: [{ label: "" }],
      forkData: { forkPubKey: "", forkEventoPointer: "" },
      hashtags: [{ hashtags: "" }],
    };
    linkValidationStatus = [];
    linkNameValidationStatus = [];
    eventToEdit = null;
  }

  function handleRemoveLink(index: number) {
    removeLinkField(index);
  }
  function handleRemoveHashTag(index: number) {
    removeHashTagField(index);
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

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ",") {
      addHashtagField();
    }
  }
</script>
{#if publishKind1}
<div class="modal">
  <div class="modal-content">
    <PublishKind1 listTitle={formData.title} listURL={`${$page.url.origin}/${$ndkUser?.npub}`} bind:isPublished={isKind1Published}/>
    <div class="closeModal">
      <button class="iconButton" on:click={() => (publishKind1 = false)}><CloseIcon size={18} /></button>
    </div>
  </div>
</div>
{/if}
<!-- {#if showSpinner}
  <div class="spinnerContainer">
    <Spinner size="xlarge" />
  </div>
{/if} -->
<main>
  <h2>{titleText}<span class="inline-span"><InfoDialog whatInfo="new-list" /></span></h2>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="formFieldsContainer text-align-start">
      <h4><label for="title">Title <span style="color: red;">*</span></label></h4>
      <input type="text" id="title" placeholder="Ex. My links" bind:value={formData.title} />

      <h4><label for="title">Summary</label></h4>
      <input type="text" id="summary" placeholder="Brief description of your list" bind:value={formData.summary} maxlength="120"/>
      <h4>Links <span style="color: red;">*</span></h4>
      {#each formData.links as linkData, index}
        <div class="linkField" class:commonBorderStyle={focusedIndex === index}>
          <div class="inputWithIcon">
            <label for={`description-${index}`}><TextIcon size={18} /></label>
            <input
              class="inputLinkDescription"
              type="text"
              id={`description-${index}`}
              placeholder="Link name"
              bind:value={linkData.description}
              on:input={validateAllURLNames}
            />
          </div>

          <div class="inputWithIcon">
            <label for={`link-${index}`}><LinkIcon size={18} /></label>
            <input
              type="text"
              id={`link-${index}`}
              placeholder="URL: https://..."
              bind:value={linkData.link}
              on:input={validateAllURLs}
            />
          </div>

          {#if !linkValidationStatus[index] && linkData.link.trim()}
            <span class:hidden={linkData.link.trim() && linkValidationStatus[index]}
              ><span class="badge variant-filled"><InfoIcon size={18} /> Prefix needed <span style="color: red;">*</span></span></span
            >
          {/if}

          {#if formData.links.length > 1}
            <div>
              <button
                type="button"
                on:click={() => handleMoveLink(index, "up")}
                on:focus={() => handleFocus(index - 1)}
                on:blur={handleBlur}><ChevronIconVertical size={18} flipVertical={false} /></button
              >
              <button
                type="button"
                on:click={() => handleMoveLink(index, "down")}
                on:focus={() => handleFocus(index + 1)}
                on:blur={handleBlur}><ChevronIconVertical size={18} flipVertical={true} /></button
              >
              <button
                type="button"
                class="secondary-button"
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
      <hr/>
      <!-- <Disclose isBackground title="Slug/hashtags">
      {#each formData.labels as linkLabel, index}
        {#if linkLabel.label.trim() != "nostree"}
          <div class="linkField">
            <h3 class="inputWithIcon">/ Slug <InfoDialog whatInfo="list-slug" /></h3>
            <div class="inputWithIcon">
              <label for={`slug-${index}`}><SlugIcon size={18} /></label>
              <input type="text" id={`slug-${index}`} placeholder="short-slug" bind:value={linkLabel.label} />
            </div>
          </div>
        {/if}
      {/each}
      {#if formData.hashtags.length > 0}
      <h3 class="inputWithIcon"><HashtagIconcopy size={18} />Hashtags <InfoDialog whatInfo="list-hashtags" /></h3>
      {#each formData.hashtags as hashTagData, index}
        <div class="hashtagField" class:commonBorderStyle={focusedIndex === index}>
          <div class="inputWithIcon">
            <label for={`hashtag-${index}`}><HashtagIconcopy size={16} /></label>
            <input
              class="inputLinkDescription"
              type="text"
              id={`hashtag-${index}`}
              placeholder="hashtag"
              bind:value={hashTagData.hashtags}
              on:input={validateAllURLNames}
              on:keydown={handleKeyDown}
            />
          </div>

          <div>
            <button
              type="button"
              class="secondary-button removeHashtagButton"
              on:click={() => {
                handleRemoveHashTag(index);
              }}><BinIcon size={18} /></button
            >
          </div>
        </div>
      {/each}
      {/if}
      <button type="button" class="secondary-button" on:click={() => addHashtagField()}><HashtagIconcopy size={18}/> Add hashtag</button>
    </Disclose> -->
      <div class="formButtons">
        {#if areAllLinksValid && formData.title.trim() != ""}
        <div>
          <div class="insertButtons">
            <button type="button" on:click={() => addLinkField(true)}><InsertIcon size={18} /></button>
            <button type="button" on:click={() => addLinkField(false)}><InsertIcon size={18} flipVertical={true} /></button>
          </div>
          <div class="formButtons">
            <button type="submit">Publish</button>
            <button type="button" on:click={handleReset}><ResetIcon size={18} /></button>
          </div>
        </div>
        {:else}
        <div>
          <div class="insertButtons">
            <button type="button" on:click={() => addLinkField(true)}><InsertIcon size={18} /></button>
            <button type="button" on:click={() => addLinkField(false)}><InsertIcon size={18} flipVertical={true} /></button>
          </div>
          <div class="formButtons">
            <button type="submit">Publish</button>
            <button type="button" on:click={handleReset}><ResetIcon size={18} /></button>
          </div>
        </div>
        {/if}
      </div>
    </div>
  </form>
</main>

<!-- <style>
  .formButtons {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.3em; 
  }
  .insertButtons{
    display: grid;
    grid-template-columns: auto auto; 
    gap: 0.3em; 
  }

  button {
    display: inline-flex;
    line-height: normal;
    padding: 0.3em;
  }

  form {
    padding-top: 0.5em;
  }

  .formFieldsContainer {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    width: 80%;
    margin: auto;
  }
  @media screen and (max-width: 479px) {
    .formFieldsContainer {
      width: auto;
    }
  }

  .linkField {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    /* align-items: center; */
    padding-top: 0.2em;
  }

  .hashtagField {
    display: flex;
    gap: 0.3em;
    align-items: center;
    padding-top: 0.2em;
    position: relative;
  }
  .inputWithIcon label {
    display: flex;
    align-items: center;
  }
  .inputLinkDescription:focus {
    background-color: var(--text-color);
    color: var(--background-color);
  }
  .secondary-button {
	width: fit-content;
    }
</style> -->
