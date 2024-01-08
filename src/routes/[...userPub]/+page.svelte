<script lang="ts">
  import { page } from "$app/stores";
  import ProfileCard from "$lib/components/profile-card.svelte";
  import EventCard from "$lib/components/event-card.svelte";
  import PlusSmall from "$lib/elements/icons/plus-small.svelte";
  import { goto } from "$app/navigation";
  import { kindLinks} from "$lib/utils/constants";
  import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
  import { outNostrLinksUrl } from "$lib/utils/constants";
  import OstrichIcon from "$lib/elements/icons/ostrich-icon.svelte";
  import LinkOut from "$lib/elements/icons/link-out.svelte";
  import { nip19 } from "nostr-tools";

  let isEditHappens: boolean = false;
  let linkListLength: number;
  let userProfile: NDKUserProfile;
  let userNpub = nip19.npubEncode($page.data.pubkey)
  $: userPubKey = $page.data.pubkey;
  $: segments = $page.data.segments;
</script>
<svelte:head>
  {#if userProfile}
  <title>{userProfile.displayName ? userProfile.displayName : userProfile.name}</title>
  <meta name="description" content={userProfile.about ? userProfile.about : ""} />
  <meta property="og:title" content={userProfile.displayName ? userProfile.displayName : userProfile.name} />
  <meta property="og:description" content={userProfile.about ? userProfile.about : ""} />
  {/if}
</svelte:head>
  {#key userPubKey || segments}
    <ProfileCard userPub={userPubKey} bind:userProfile />
    {#key $page.url.pathname.split("/").length > 2}
      {#key isEditHappens}
        <div>
          <EventCard
            bind:linkListLength 
            bind:isEditHappens
            userPub={userPubKey}
            eventKind={kindLinks}
            listLabel={segments[0]}
          />
          {#if linkListLength == undefined}
          <div class=" flex flex-col gap-2 justify-center common-ring p-4 w-fit m-auto rounded-container-token card">
            <button class="btn btn-icon variant-filled m-auto" on:click={() => goto(`/new`)}>
              <PlusSmall size={30} />
            </button>
            <p class="text-xl">No links yet</p>
            <hr/>
            <div class="flex gap-2 flex-wrap justify-center">
              <a href="{outNostrLinksUrl}/{userNpub}" target="_blank" rel="noreferrer"><span class="common-badge-ghost gap-2">View profile in nostr <LinkOut size={18} /></span></a>
              <a href="nostr:{userNpub}"><span class="common-badge-ghost gap-2">View profile in native client <OstrichIcon size={18} /></span></a>
            </div>
          </div>
          {/if}
        </div>
      {/key}
    {/key}
  {/key}
