<script lang="ts">
  import { NDKEvent} from '@nostr-dev-kit/ndk';
  import ndk from '$lib/stores/provider';
  import LinkField from './link-field.svelte';
  import type { FormData } from "$lib/classes/list";
  import { Button } from 'agnostic-svelte';
  import ResetIcon from '$lib/elements/icons/reset-icon.svelte';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';

  let formData: FormData = {
    title: '',
    links: [],
  };
  let isTitleEmpty = true;

  $: {
    isTitleEmpty = formData.title.trim() === '';

    if (formData.title.trim() === '') {
      titleText = 'New List';
    } else {
      titleText = formData.title;
    }
  }

  let titleText = 'New List';

  function handleSubmit() {
    console.log(formData);
     const ndkEvent = new NDKEvent($ndk);
     ndkEvent.kind = 30303;
     ndkEvent.tags = [['title',formData.title], ['d', `nostree-${formData.title}`]];
     for (const linkData of formData.links) {
      const { link, description } = linkData;
      ndkEvent.tags.push(['r', link, description]);
    }
    ndkEvent.publish();
  }

  function addLinkField() {
    formData.links = [...formData.links, { link: '', description: '' }];
  }

  function removeLinkField(index: number) {
    formData.links = formData.links.filter((_, i) => i !== index);
  }

  function handleReset() {
    formData = {
      title: '',
      links: [],
    };
  }

  function handleRemoveLink(index: number) {
    removeLinkField(index);
  }
</script>

<main>
  <h2>{titleText}</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="titleImput">
      <label for="title">Title</label>
      <input type="text" id="title" placeholder="Ex. My links" bind:value={formData.title} />
    </div>
    {#each formData.links as linkData, index}
      <LinkField linkData={linkData} onRemove={() => handleRemoveLink(index)} />
    {/each}
    {#if !isTitleEmpty}
    <Button isBlock type="button" on:click={addLinkField}><PlusSmall size={18} /></Button>
    {/if}
    <div class="formButtons">
    {#if isTitleEmpty}
      <Button isBlock type="submit" isDisabled>Publish</Button>
    {:else}
      <Button isBlock type="submit">Publish</Button>
    {/if}
    {#if !isTitleEmpty}
      <button type="button" on:click={handleReset}><ResetIcon size={18} /></button>
    {/if}
    </div>
  </form>
</main>
<style>
  .titleImput {
    margin-bottom: 1em;
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
