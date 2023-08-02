<script lang="ts">
  import { NDKEvent } from '@nostr-dev-kit/ndk';
  import ndk from '$lib/stores/provider';
  import { Button, Tag } from 'agnostic-svelte';
  import ResetIcon from '$lib/elements/icons/reset-icon.svelte';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';
  import LinkIcon from '$lib/elements/icons/link-icon.svelte';
  import TextIcon from '$lib/elements/icons/text-icon.svelte';
  import BinIcon from '$lib/elements/icons/bin-icon.svelte';
  import type { LinkData } from '$lib/classes/list';
  import { findListTags, getTagValue } from '$lib/utils/helpers';
  import { v4 as uuidv4 } from 'uuid';
  import InfoIcon from '$lib/elements/icons/info-icon.svelte';

  export let eventToEdit: NDKEvent | null = null;
  
  const validPrefixes: string[] = ['http://', 'https://', 'ftp://', 'nostr:'];
  let linkValidationStatus: boolean[] = [];

  let formData = {
    title: '',
    links: [{ link: '', description: '' }],
  };
  if (eventToEdit) {
    console.log(eventToEdit);
    let title = getTagValue(eventToEdit.tags, "title");
    const rTags = findListTags(eventToEdit.tags);
    const links = rTags.map(tag => ({ link: tag.url, description: tag.text }));
    formData = {
      title: title,
      links: links,
    };
    validateAllURLs();
  }

  let isTitleEmpty = true;
  let titleText = 'New List';

  $: {
    isTitleEmpty = formData.title.trim() === '';
    if (formData.title.trim() === '') {
      titleText = 'New List';
    } else {
      titleText = formData.title;
    }
  }

  function validateAllURLs() {
    linkValidationStatus = formData.links.map(linkData => {
      const isValidPrefix = validPrefixes.some(prefix => linkData.link.startsWith(prefix));
      return isValidPrefix;
    });
  }

  function handleInput() {
      validateAllURLs();
    };
  
  // function validateURL(linkData: LinkData, index: number) {
  //   const isValidPrefix = validPrefixes.some(prefix => linkData.link.startsWith(prefix));
  //   linkValidationStatus[index] = isValidPrefix;
  //   linkValidationStatus = [...linkValidationStatus];
  // }

  let areAllLinksValid: boolean = false;

  $: {
    areAllLinksValid = linkValidationStatus.length > 0 && linkValidationStatus.every(status => status);
  }

  function handleSubmit() {
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = 30303;
    if (eventToEdit) {
      ndkEvent.tags = [['title', formData.title], ['d', getTagValue(eventToEdit.tags, "d")]];
    } else {
      ndkEvent.tags = [['title', formData.title], ['d', `nostree-${uuidv4()}`]];
    }
    for (const linkData of formData.links) {
      const { link, description } = linkData;
      ndkEvent.tags.push(['r', link, description]);
    }
    ndkEvent.publish();
  }

  function addLinkField() {
    formData.links = [...formData.links, { link: '', description: '' }];
    linkValidationStatus.push(false);
    validateAllURLs();
  }

  function removeLinkField(index: number) {
    formData.links = formData.links.filter((_, i) => i !== index);
    linkValidationStatus.splice(index, 1);
  }

  function handleReset() {
    formData = {
      title: '',
      links: [{ link: '', description: '' }],
    };
    linkValidationStatus = [];
    eventToEdit = null;
  }

  function handleRemoveLink(index: number) {
    removeLinkField(index);
  }
</script>

<main>
  <h2>{titleText}</h2>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="formFieldsContainer">
      <label for="title">Title</label>
      <input type="text" id="title" placeholder="Ex. My links" bind:value={formData.title} />
      {#each formData.links as linkData, index}
      <div class="linkField">
        <div>
          <label for={`link-${index}`}><LinkIcon size={18} /></label>
          <input type="text" id={`link-${index}`} placeholder="https://..." bind:value={linkData.link} on:input={handleInput} />
        </div>
        {#if !linkValidationStatus[index] && linkData.link.trim() !== ''}
        <Tag><InfoIcon size={18} /> Prefix needed</Tag>
        {/if}
        <div>
          <label for={`description-${index}`}><TextIcon size={18} /></label>
          <input type="text" id={`description-${index}`} placeholder="Link name" bind:value={linkData.description} />
        </div>
        {#if formData.links.length > 1}
        <button type="button" on:click={() => handleRemoveLink(index)}><BinIcon size={18} /></button>
        {/if}
      </div>
      {/each}
    </div>

    <div class="formButtons">
      {#if areAllLinksValid}
      <Button type="button" isRounded on:click={addLinkField}><PlusSmall size={18} /></Button>
      <Button isBlock type="submit">Publish</Button>
      <Button type="button" isRounded on:click={handleReset}><ResetIcon size={18} /></Button>
      {:else}

      <Button type="button" disabled isRounded on:click={addLinkField}><PlusSmall size={18} /></Button>
      <Button isBlock type="submit" disabled>Publish</Button>
      <Button type="button" isRounded disabled on:click={handleReset}><ResetIcon size={18} /></Button>
      {/if}

    </div>
  </form>
</main>

<style>
  .formButtons {
    display: flex;
    gap: 0.3em;
    align-items: center;
    justify-content: center;
  }
  button {
    display: inline-flex;
    line-height: normal;
  }
  form{
    padding-top: 0.5em;
  }
  .formFieldsContainer {
    display: flex;
    flex-direction: column;
    gap:0.3em
  }
  #title {
    text-align: center;
  }
</style>
