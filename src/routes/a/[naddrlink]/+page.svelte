<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from "$lib/components/profile-card.svelte";
  import EventCard from "$lib/components/event-card.svelte";
  import { kindLinks, kindArticles, outNostrLinksUrl } from "$lib/utils/constants";
  import { nip19 } from "nostr-tools";
    import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
  let naddrPointer: any;
  let decPubkey: string;
  let decEventKind: number;
  let decIdentifier: string;
  let userProfile: NDKUserProfile;
  $: {
    naddrPointer = nip19.decode($page.params.naddrlink);
    decPubkey = nip19.npubEncode(naddrPointer.data.pubkey);
    decEventKind = naddrPointer.data.kind;
    decIdentifier = naddrPointer.data.identifier;
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

  {#key naddrPointer}
    <ProfileCard userPub={decPubkey} bind:userProfile />
    <div>
      {#if decEventKind == kindLinks}
        <EventCard userPub={decPubkey} eventKind={decEventKind} dValue={decIdentifier} />
      {:else if decEventKind == kindArticles}
        <EventCard userPub={decPubkey} eventKind={decEventKind} dValue={decIdentifier} />
      {/if}
    </div>
    {#if decEventKind == kindArticles}
      <a class="common-btn-filled" href={`${outNostrLinksUrl}/${$page.params.naddrlink}`} target="_blank" rel="noreferrer noopener">Read article</a>
    {/if}
  {/key}
