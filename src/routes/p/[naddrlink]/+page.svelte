<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from '$lib/components/profile-card.svelte';
  import EventCard from '$lib/components/event-card.svelte';
  import { lengthStore } from '$lib/stores/eventListsLengths';
  import PlusSmall from '$lib/elements/icons/plus-small.svelte';
  import { goto } from '$app/navigation';
  import { kindLinks, kindNotes, kindArticles } from '$lib/utils/constants';
  import { isNip05Valid } from "$lib/stores/user";
  import { decodeEventPointer } from "$lib/utils/helpers";
    import type { DecodeResult, ProfilePointer} from "nostr-tools/lib/nip19";
    import { nip19 } from "nostr-tools";

   let naddrPointer: any = decodeEventPointer($page.params.naddrlink);
  //  console.log(naddrPointer);
   let decPubkey: string = nip19.npubEncode(naddrPointer.data.pubkey);
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
<div class="commonContainerStyle">

 {#key naddrPointer}
<ProfileCard userPub={decPubkey} />
<div>
  <EventCard userPub={decPubkey} eventKind={kindLinks} dValue={naddrPointer.data.identifier} />
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