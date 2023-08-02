<script lang="ts">
  import type { PageData } from './$types';

  import ProfileCard from '$lib/components/profile-card.svelte';
  import EventCard from '$lib/components/event-card.svelte';
  import { lengthStore } from '$lib/stores/eventListsLengths';
    import PlusSmall from '$lib/elements/icons/plus-small.svelte';
    import { goto } from '$app/navigation';

  export let data: PageData;
  let user = data.pubkey;

  let kindLinks = 30303;
  let kindNotes = 1;
  let kindArticles = 30023;
  let visibleComponent:number = kindLinks;
  let lengths: { [key: number]: number } = {};

  lengthStore.subscribe((newLengths) => {
  lengths = newLengths;
  });

  function showComponent(kind: number) {
    visibleComponent = kind;
  }

</script>

<ProfileCard userPub={user} />

<div class={visibleComponent === kindLinks ? "visible" : "hidden"}>
  <EventCard userPub={user} eventKind={kindLinks} />
  {#if lengths[kindLinks] == 0}
  <button class="noEventsButton" on:click={() => goto(`/new`)}>
    <div class="noEvents">
      <PlusSmall size={30} />
      <p>There are no links yet, create a new one</p>
    </div>
  </button>
  {/if}
</div>

<div class={visibleComponent === kindNotes ? "visible" : "hidden"}>
  <EventCard userPub={user} eventKind={kindNotes} />
</div>

<div class={visibleComponent === kindArticles ? "visible" : "hidden"}>
  <EventCard userPub={user} eventKind={kindArticles} />
</div>


<button class="switchButtons" class:unSelected={visibleComponent != kindLinks} on:click={() => showComponent(kindLinks)}>My links</button>

{#if lengths[kindNotes] >= 1}
<button class="switchButtons" class:unSelected={visibleComponent != kindNotes} on:click={() => showComponent(kindNotes)}>My notes</button>
{/if}
{#if lengths[kindArticles] >= 1}
<button class="switchButtons" class:unSelected={visibleComponent != kindArticles} on:click={() => showComponent(kindArticles)}>My articles</button>
{/if}


<style>
  .switchButtons {
    padding: 0.1em 0.5em;
    background-color: var(--accent-color);
  }
  .unSelected {
    border: var(--common-border-style);
    color: var(--accent-color);
    background-color: var(--background-color);
  }
  .hidden {
    display: none;
  }
  .noEvents {
    background: var(--accent-color);
    display: flex;
    border-radius: var(--agnostic-radius);
    height: 170px;
    max-width: 300px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1em;
  }
  .noEventsButton {
    padding: 0;
  }
</style>