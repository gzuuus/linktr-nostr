<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from "$lib/components/profile-card.svelte";
  import EventCard from "$lib/components/event-card.svelte";
  import { kindLinks, kindArticles, outNostrLinksUrl } from "$lib/utils/constants";
  import { nip19 } from "nostr-tools";
  import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
  let naddrPointer: any;
  let Pubkey: string;
  let EventKind: number;
  let Identifier: string;
  let userProfile: NDKUserProfile;
  $: {
    naddrPointer = nip19.decode($page.params.naddrlink);
    Pubkey = naddrPointer.data.pubkey;
    EventKind = naddrPointer.data.kind;
    Identifier = naddrPointer.data.identifier;
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
    <ProfileCard userPub={Pubkey} bind:userProfile />
    <div>
      {#if EventKind == kindLinks }
        <EventCard userPub={Pubkey} eventKind={EventKind} dValue={Identifier} />
      {:else if EventKind == kindArticles}
        <EventCard userPub={Pubkey} eventKind={EventKind} dValue={Identifier} />
      {/if}
    </div>
    {#if EventKind == kindArticles}
      <a class="common-btn-filled" href={`${outNostrLinksUrl}/${$page.params.naddrlink}`} target="_blank" rel="noreferrer noopener">Read article</a>
    {/if}
  {/key}
