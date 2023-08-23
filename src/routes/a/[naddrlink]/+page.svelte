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

  let naddrPointer: any = nip19.decode($page.params.naddrlink);
   let decPubkey: string = nip19.npubEncode(naddrPointer.data.pubkey);
   let deceventKind: number = naddrPointer.data.kind;
   let decidentifier: string = naddrPointer.data.identifier;

</script>
<div class="commonContainerStyle">

{#key naddrPointer}
  <ProfileCard userPub={decPubkey} />
  <div>
    {#if deceventKind == kindLinks}
    <EventCard userPub={decPubkey} eventKind={deceventKind} dValue={decidentifier}/>
    {:else if deceventKind == kindArticles}
    <EventCard userPub={decPubkey} eventKind={deceventKind} dValue={decidentifier} showSummary={true} />
    {/if}
  </div>
  {#if deceventKind == kindArticles}
  <div>
    <hr>
    <h2>Other articles</h2>
    <EventCard userPub={decPubkey} eventKind={deceventKind}/>
  </div>
  {/if}
{/key}
</div>