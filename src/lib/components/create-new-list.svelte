<script lang="ts">
  import { NDKEvent } from '@nostr-dev-kit/ndk';
  import ndk from '$lib/stores/provider';
  import { Button, Spinner, Tag } from 'agnostic-svelte';
  import ResetIcon from '$lib/elements/icons/reset-icon.svelte';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';
  import LinkIcon from '$lib/elements/icons/link-icon.svelte';
  import TextIcon from '$lib/elements/icons/text-icon.svelte';
  import BinIcon from '$lib/elements/icons/bin-icon.svelte';
  import { findListTags, findOtherTags, getTagValue } from '$lib/utils/helpers';
  import { v4 as uuidv4 } from 'uuid';
  import InfoIcon from '$lib/elements/icons/info-icon.svelte';
  import { goto } from '$app/navigation';
  import { ndkUser } from '$lib/stores/user';
  import { kindLinks } from '$lib/utils/constants';
  import { generateNanoId } from '$lib/utils/helpers';
  import InfoDialog from '$lib/components/info-dialog.svelte';

  export let eventToEdit: NDKEvent | null = null;
  let showSpinner = false;
  const newDTag = `nostree-${uuidv4()}`;
  const validPrefixes: string[] = ['http://', 'https://', 'ftp://', 'nostr:'];
  let linkValidationStatus: boolean[] = [];
  let linkNameValidationStatus: boolean[] = [];

  let formData = {
    title: '',
    links: [{ link: '', description: '' }],
    labels: [{ label: '' }],
  };

  if (eventToEdit) {
    let title = getTagValue(eventToEdit.tags, "title");
    const rTags = findListTags(eventToEdit.tags);
    const links = rTags.map(tag => ({ link: tag.url, description: tag.text }));
    const labels = findOtherTags(eventToEdit.tags, 'l').map(tag => ({ label: tag }));
    formData = {
      title: title,
      links: links,
      labels: labels
    };
    validateAllURLs();
    validateAllURLNames()
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
  
  function validateAllURLNames() {
  linkNameValidationStatus = formData.links.map(linkData => linkData.description.trim() !== "");
}

  $: areAllLinksValid = linkValidationStatus.length > 0 && linkValidationStatus.every(status => status) && linkNameValidationStatus.length > 0 && linkNameValidationStatus.every(status => status);

  function handleSubmit() {
    showSpinner = true;
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = kindLinks;
    if (eventToEdit) {
    ndkEvent.tags = [['title', formData.title], ['d', getTagValue(eventToEdit.tags, "d")]];
      for (const labelData of formData.labels) {
        const { label } = labelData;
        ndkEvent.tags.push(['l', encodeURIComponent(label.trim())]);
      }
    } else {
      
      ndkEvent.tags = [['title', formData.title], 
      ['d', newDTag], 
      ['l', 'nostree'],
      ['l', formData.labels[0].label ? formData.labels[0].label : generateNanoId($ndkUser?.npub)]];
    }
    for (const linkData of formData.links) {
      const { link, description } = linkData;
      ndkEvent.tags.push(['r', link, description]);
    }
    ndkEvent.publish().then(() =>{
      showSpinner = false;
      goto(`/${$ndkUser?.npub}`)

    }).catch((error) => {
            console.log("Error:", error);
            showSpinner = false;
    });
  }

  function addLinkField() {
    formData.links = [...formData.links, { link: '', description: '' }];
    linkValidationStatus.push(false);
    linkNameValidationStatus.push(false);
    validateAllURLs();
    validateAllURLNames();
  }

  function removeLinkField(index: number) {
    formData.links = formData.links.filter((_, i) => i !== index);
    linkValidationStatus.splice(index, 1);
    linkNameValidationStatus.splice(index, 1);
  }

  function handleReset() {
    formData = {
      title: '',
      links: [{ link: '', description: '' }],
      labels: [{ label: '' }]
    };
    linkValidationStatus = [];
    linkNameValidationStatus = [];
    eventToEdit = null;
  }

  function handleRemoveLink(index: number) {
    removeLinkField(index);
  }
</script>
{#if showSpinner}
<div class="spinnerContainer">
<Spinner size="xlarge"/>
</div>
{/if}
<main>
  <h2>{titleText}<span class="inline-span"><InfoDialog whatInfo="new-list"/></span></h2>
  

  <form on:submit|preventDefault={handleSubmit}>
    <div class="formFieldsContainer">
      <h3><label for="title">Title</label></h3>
      <input type="text" id="title" placeholder="Ex. My links" bind:value={formData.title} />

      {#each formData.links as linkData, index}
        <div class="linkField">
          <div class="inputWithIcon">
            <label for={`link-${index}`}><LinkIcon size={18} /></label>
            <input type="text" id={`link-${index}`} placeholder="https://..." bind:value={linkData.link} on:input={validateAllURLs} />
          </div>

          <div class="inputWithIcon">
            <label for={`description-${index}`}><TextIcon size={18} /></label>
            <input type="text" id={`description-${index}`} placeholder="Link name" bind:value={linkData.description} on:input={validateAllURLNames}/>
          </div>
          {#if !linkValidationStatus[index] && linkData.link.trim()}
           <span class:hidden={linkData.link.trim() && linkValidationStatus[index]}><Tag><InfoIcon size={18}/> Prefix needed</Tag></span>
          {/if}

          {#if formData.links.length > 1}
            <button type="button" on:click={() => handleRemoveLink(index)}><BinIcon size={18} /></button>
          {/if}
        </div>
      {/each}

      {#each formData.labels as linkLabel, index}
      {#if linkLabel.label.trim() != 'nostree'}
        <div class="linkField">
          <h3 class="inputWithIcon">Slug <InfoDialog whatInfo="list-slug"/></h3>
          
          <div class="inputWithIcon">
            <label for={`slug`}><LinkIcon size={18} /></label>
            <input type="text" id={`link-${index}`} placeholder="short-slug" bind:value={linkLabel.label}/>
          </div>

          {#if !linkValidationStatus[index] && linkLabel.label.trim()}
           <span class:hidden={linkLabel.label.trim() && linkValidationStatus[index]}><Tag><InfoIcon size={18}/> Prefix needed</Tag></span>
          {/if}

          {#if formData.links.length > 1}
            <button type="button" on:click={() => handleRemoveLink(index)}><BinIcon size={18} /></button>
          {/if}
        </div>
        {/if}
      {/each}
    </div>
    
    <div class="formButtons">
      {#if areAllLinksValid && formData.title.trim() != ''}
        <Button type="button" isRounded on:click={addLinkField}><PlusSmall size={18} /></Button>
        <Button isBlock type="submit">Publish</Button>
      {:else}
        <Button type="button" disabled isRounded on:click={addLinkField}><PlusSmall size={18} /></Button>
        <Button isBlock type="submit" disabled>Publish</Button>
      {/if}
      <Button type="button" isRounded on:click={handleReset}><ResetIcon size={18} /></Button>
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
    align-items: center;
  }

  .inputWithIcon label {
    display: flex;
    align-items: center;
  }

  #title {
    text-align: center;
  }
</style>
