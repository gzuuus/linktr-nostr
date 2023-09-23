<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from "$lib/components/profile-card.svelte";
  import EventCard from "$lib/components/event-card.svelte";
  import { kindLinks, kindArticles } from "$lib/utils/constants";
  import { nip19 } from "nostr-tools";
    import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
  let naddrPointer: any;
  let decPubkey: string;
  let deceventKind: number;
  let decidentifier: string;
  let userProfile: NDKUserProfile;
  $: {
    naddrPointer = nip19.decode($page.params.naddrlink);
    decPubkey = nip19.npubEncode(naddrPointer.data.pubkey);
    deceventKind = naddrPointer.data.kind;
    decidentifier = naddrPointer.data.identifier;
  }
</script>
<svelte:head>
  {#if userProfile}
  <title>{userProfile.name ? userProfile.name : userProfile.displayName}</title>
  <meta name="description" content={userProfile.about ? userProfile.about : ""} />
  <meta property="og:title" content={userProfile.name ? userProfile.name : userProfile.displayName} />
  <meta property="og:description" content={userProfile.about ? userProfile.about : ""} />
  {/if}
</svelte:head>
<div class="commonContainerStyle">
  {#key naddrPointer}
    <ProfileCard userPub={decPubkey} bind:userProfile />
    <div>
      {#if deceventKind == kindLinks}
        <EventCard userPub={decPubkey} eventKind={deceventKind} dValue={decidentifier} />
      {:else if deceventKind == kindArticles}
        <EventCard userPub={decPubkey} eventKind={deceventKind} dValue={decidentifier} showSummary={true} />
      {/if}
    </div>
    {#if deceventKind == kindArticles}
      <div>
        <hr />
        <h2>Other articles</h2>
        <EventCard userPub={decPubkey} eventKind={deceventKind} />
      </div>
    {/if}
  {/key}
</div>
