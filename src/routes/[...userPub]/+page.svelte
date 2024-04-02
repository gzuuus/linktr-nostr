<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from "$lib/components/profile-card.svelte";
  import EventCard from "$lib/components/event-card.svelte";
  import { kindLinks} from "$lib/utils/constants";
  import type { NDKUserProfile } from "@nostr-dev-kit/ndk";

  let isEditHappens: boolean = false;
  let userProfile: NDKUserProfile;
</script>
<svelte:head>
  {#if userProfile}
  <title>{userProfile.displayName ? userProfile.displayName : userProfile.name}</title>
  <meta name="description" content={userProfile.about ? userProfile.about : ""} />
  <meta property="og:title" content={userProfile.displayName ? userProfile.displayName : userProfile.name} />
  <meta property="og:description" content={userProfile.about ? userProfile.about : ""} />
  {/if}
</svelte:head>
  {#key $page.data.pubkey || $page.url.href}
    <ProfileCard userPub={$page.data.pubkey} bind:userProfile />
    {#key $page.url.pathname.split("/").length > 2}
      {#key isEditHappens}
        <div>
          <EventCard
            bind:isEditHappens
            userPub={$page.data.pubkey}
            eventKind={kindLinks}
            listLabel={$page.data.segments[0]}
          />
        </div>
      {/key}
    {/key}
  {/key}
