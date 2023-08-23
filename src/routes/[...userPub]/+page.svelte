<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from '$lib/components/profile-card.svelte';
  import EventCard from '$lib/components/event-card.svelte';
  import { lengthStore } from '$lib/stores/eventListsLengths';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';
  import { goto } from '$app/navigation';
  import { kindLinks, kindNotes, kindArticles } from '$lib/utils/constants';
  import { isNip05Valid } from "$lib/stores/user";
   $: user = $page.data.npub;
   $: segments = $page.data.segments;
   $: visibleComponent = lengths[kindLinks] == 0 ? kindNotes : kindLinks;
   let lengths: { [key: number]: number } = {};

   lengthStore.subscribe((newLengths) => {
   lengths = newLengths;
   });

   function showComponent(kind: number) {
     visibleComponent = kind;
   }

</script>
<div class="commonContainerStyle">

{#key user}

<ProfileCard userPub={user} />
<div>
  {#if lengths[kindNotes] != 0 || lengths[kindArticles] != 0}
    <button class="switchButtons" class:selected={visibleComponent == kindLinks} on:click={() => showComponent(kindLinks)}>Links</button>
  {/if}
  {#if lengths[kindNotes] >= 1}
    <button class="switchButtons" class:selected={visibleComponent == kindNotes} on:click={() => showComponent(kindNotes)}>Notes</button>
  {/if}
  {#if lengths[kindArticles] >= 1}
    <button class="switchButtons" class:selected={visibleComponent == kindArticles} on:click={() => showComponent(kindArticles)}>Articles</button>
  {/if}
</div>

{#key $page.url.pathname.split('/').length > 2}
<div class={visibleComponent === kindLinks ? "visible" : "hidden"}>
  <EventCard userPub={user} eventKind={kindLinks} listLabel={segments[0]} />
  {#if lengths[kindLinks] == 0}
  <button class="noEventsButton" on:click={() => goto(`/new`)}>
    <div class="noEvents">
      <div class="borderedSection">
        <PlusSmall size={30} />
      </div>
      <p>No links yet</p>
    </div>
  </button>
  {/if}
</div>
{/key}


<div class={visibleComponent === kindNotes ? "visible" : "hidden"}>
  <EventCard userPub={user} eventKind={kindNotes} />
</div>

<div class={visibleComponent === kindArticles ? "visible" : "hidden"}>
  <EventCard userPub={user} eventKind={kindArticles} />
</div>

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