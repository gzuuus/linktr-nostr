<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from '$lib/components/profile-card.svelte';
  import EventCard from '$lib/components/event-card.svelte';
  import { lengthStore } from '$lib/stores/eventListsLengths';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';
  import { goto } from '$app/navigation';
  import { kindLinks, kindNotes, kindArticles } from '$lib/utils/constants';
  import { isNip05Valid } from "$lib/stores/user";
    import type { DecodeResult, ProfilePointer} from "nostr-tools/lib/nip19";
    import { nip19 } from "nostr-tools";

  //  let naddrPointer: any = nip19.decode($page.params.naddrlink);
  //  console.log($page.params.naddrlink);
  //  let decPubkey: string = nip19.npubEncode(naddrPointer.data.pubkey);
  //  let eventKind: number = naddrPointer.data.kind;
  //  let id: string = naddrPointer.data.identifier;
  //  console.log(naddrPointer.data.pubkey.nip19.npubEncode());
  //  $: visibleComponent = lengths[kindLinks] == 0 ? kindNotes : kindLinks;
  //  let lengths: { [key: number]: number } = {};

  //  lengthStore.subscribe((newLengths) => {
  //  lengths = newLengths;
  //  });

  //  function showComponent(kind: number) {
  //    visibleComponent = kind;
  //  }

</script>
<!-- <div class="commonContainerStyle">

 {#key naddrPointer}
<ProfileCard userPub={decPubkey} />
<div>
  <EventCard userPub={decPubkey} eventKind={eventKind} dValue={id} listLabel={''} />
</div>

{/key}
</div> -->


<style>
  /* .noEvents {
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
  } */
</style>