<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from '$lib/components/profile-card.svelte';
  import EventCard from '$lib/components/event-card.svelte';
  // import { lengthStore } from '$lib/stores/eventListsLengths';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';
  import { goto } from '$app/navigation';
  import { kindLinks, kindNotes, kindArticles } from '$lib/utils/constants';

   let isEditHappens:boolean
   let linkListLength:number
   $: user = $page.data.npub;
   $: segments = $page.data.segments;
   $: visibleComponent = lengths[kindLinks] == 0 ? kindNotes : kindLinks;
   let lengths: { [key: number]: number } = {};

   function showComponent(kind: number) {
     visibleComponent = kind;
   }

</script>
<div class="commonContainerStyle">
{#key user}
<ProfileCard userPub={user} vanityNip05={$page.data.vanityNip05Build} />
<div>
</div>

{#key $page.url.pathname.split('/').length > 2 }
{#key isEditHappens }
<div>
  <EventCard bind:linkListLength={linkListLength} bind:isEditHappens={isEditHappens} userPub={user} eventKind={kindLinks} listLabel={segments[0]} />
  {#if linkListLength == 0}
  <button class="noEventsButton" on:click={() => goto(`/new`)}>
    <div class="noEvents">
      <div class="borderedSection">
        <PlusSmall size={30} />
      </div>
      <p>No links yet</p>
    </div>
  </button>
  <p>See profile in nostr client</p>
  <a href="https://nostr.com/{user}" target="_blank" rel="noopener noreferrer"><button class="iconButton">See outside</button></a>
  {/if}
</div>
{/key}
{/key}
{/key}
</div>

<style>
  .noEvents {
    background: var(--background-color);
    display: flex;
    border-radius: var(--agnostic-radius);
    height: 170px;
    max-width: 300px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1em;
    border: var(--common-border-style);
    color: var(--text-color);
  }
  .noEventsButton {
    padding: 0;
    width: 80%;
  }
</style>