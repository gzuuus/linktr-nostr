<script lang="ts">
  import { NDKEvent } from '@nostr-dev-kit/ndk';
  import ndk from '$lib/stores/provider';
  import { Button } from 'agnostic-svelte';
  import ResetIcon from '$lib/elements/icons/reset-icon.svelte';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';
  import LinkIcon from '$lib/elements/icons/link-icon.svelte';
  import TextIcon from '$lib/elements/icons/text-icon.svelte';
  import BinIcon from '$lib/elements/icons/bin-icon.svelte';
  import type { LinkData } from '$lib/classes/list';
  import { ndkUser } from '$lib/stores/user';
  import md5 from 'crypto-js/md5';
  export let eventToEdit: string | undefined;
  
  let formData = {
    title: '',
    links: [{ link: '', description: '' }],
  };
  if (eventToEdit){
    formData = {
    title: eventToEdit,
    links: [{ link: 'suuu', description: 'sdfsdf' }],
  };
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

  let linkValidationStatus: boolean[] = [];

  function handleInput() {
    formData.links.forEach((linkData, index) => {
      validateURL(linkData, index);
    });
  }

  const validPrefixes: string[] = ['http://', 'https://', 'ftp://'];

  function validateURL(linkData: LinkData, index: number) {
    const isValidPrefix = validPrefixes.some((prefix) => linkData.link.startsWith(prefix));
    linkValidationStatus[index] = isValidPrefix;
    linkValidationStatus = [...linkValidationStatus];
  }
  let areAllLinksValid: boolean = false;

  $: {
    areAllLinksValid = linkValidationStatus.length > 0 && linkValidationStatus.every((status) => status);
  }

  function handleSubmit() {
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = 30303;
    ndkEvent.tags = [['title', formData.title], ['d', `nostree-${md5($ndkUser!.npub+formData.title)}`]];
    for (const linkData of formData.links) {
      const { link, description } = linkData;
      ndkEvent.tags.push(['r', link, description]);
    }
    ndkEvent.publish();
  }

  function addLinkField() {
    formData.links = [...formData.links, { link: '', description: '' }];
    linkValidationStatus.push(false); 
  }

  function removeLinkField(index: number) {
    formData.links = formData.links.filter((_, i) => i !== index);
    linkValidationStatus.splice(index, 1); 
  }

  function handleReset() {
    formData = {
      title: '',
      links: [],
    };
    linkValidationStatus = []; 
  }

  function handleRemoveLink(index: number) {
    removeLinkField(index);
  }
</script>

<main>
  <h2>{titleText}</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="titleInput">
      <label for="title">Title</label>
      <input type="text" id="title" placeholder="Ex. My links" bind:value={formData.title} />
    </div>
    {#each formData.links as linkData, index}
      <div class="linkField">
        <div>
          <label for={`link-${index}`}><LinkIcon size={18} /></label>
          <input type="text" id={`link-${index}`} placeholder="https://..." bind:value={linkData.link} on:input={handleInput}/>
        </div>
        {#if !linkValidationStatus[index] && linkData.link.trim() !== ''}
          <p class="prefixNeeded">Prefix needed</p>
        {/if}
        <div>
          <label for={`description-${index}`}><TextIcon size={18} /></label>
          <input type="text" id={`description-${index}`} placeholder="Link name" bind:value={linkData.description}
          />
        </div>
        <button type="button" on:click={() => handleRemoveLink(index)}><BinIcon size={18} /></button>
      </div>
    {/each}
      <Button isBlock type="button" on:click={addLinkField}><PlusSmall size={18} /></Button>
    <div class="formButtons">
      {#if areAllLinksValid}
          <Button isBlock type="submit">Publish</Button>
        {:else}
          <Button isBlock type="submit" disabled>Publish</Button>
        {/if}
        <button type="button" on:click={handleReset}><ResetIcon size={18} /></button>
    </div>
  </form>
</main>

<style>
  .linkField {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 0.3em;
  }
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
</style>
