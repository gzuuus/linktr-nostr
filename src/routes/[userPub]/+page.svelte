<script lang="ts">
    import type { PageData } from './$types';
  
    import ProfileCard from '$lib/components/profile-card.svelte';
    import EventCard from '$lib/components/event-card.svelte';
    import EventCardWip from '$lib/components/event-card-wip.svelte';
  
    export let data: PageData;
    let user = data.pubkey;
  
    let eventCardWipValue = 1;
  
    const updateEventKind = (newValue: number) => {
    eventCardWipValue = newValue;
  };

  </script>
  
<ProfileCard userPub={user} />
<EventCard userPub={user} />
{#key eventCardWipValue}
<EventCardWip userPub={user} eventKind={eventCardWipValue} />
{/key}

<button class="switchButtons" class:unSelected={eventCardWipValue != 1} on:click={() => updateEventKind(1)}>My notes</button>
<button class="switchButtons" class:unSelected={eventCardWipValue != 30023} on:click={() => updateEventKind(30023)}>My articles</button>

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
</style>