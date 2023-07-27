<script lang="ts">
    import type { LinkData } from "$lib/classes/list";
    import BinIcon from "$lib/elements/icons/bin-icon.svelte";
    import TextIcon from "$lib/elements/icons/text-icon.svelte";
    import LinkIcon from "$lib/elements/icons/link-icon.svelte";
    export let linkData: LinkData;
    export let onRemove: () => void;
  </script>
  
  <div class="linkField">
    <div>
    <label for={linkData.link}><LinkIcon size={18} /></label>
    <input type="text" placeholder="Link URL" bind:value={linkData.link} />
    </div>
    <div>
    <label for={`description-${linkData.link}`}><TextIcon size={18} /></label>
    <input type="text" id={`description-${linkData.link}`} placeholder="Link name" bind:value={linkData.description} />
    </div>
    <button type="button" on:click={onRemove}><BinIcon size={18}/></button>
  </div>
  
  <style>
    .linkField {
	display: flex;
	flex-direction: column;
	align-items: end;
    gap: 0.3em;
    }
  </style>