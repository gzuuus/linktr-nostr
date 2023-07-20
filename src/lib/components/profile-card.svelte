<script lang="ts">
    export let userPub: string | undefined;
    import ndk from '$lib/stores/provider';
    import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
    import { fade } from 'svelte/transition';
    import ParsedContent from './parse-content.svelte';
    
    let userProfile: NDKUserProfile;
    
    const user = $ndk.getUser({
             npub: userPub,
         });
    user.fetchProfile().then(() => {
             userProfile = user.profile as NDKUserProfile;
         })

</script>


{#if userProfile}
<div transition:fade class="profileContainer">
  <img transition:fade src={userProfile.image} alt="avatar"/>
  <h2>{userProfile.name}</h2>
  <!-- <p>{userProfile.about}</p> -->
</div>
{/if}


<style>
  .profileContainer {
    margin: 10px;
    border-radius: 15px;
    word-wrap: anywhere;
  }
  img {
    max-width: 160px;
    border-radius: 15px;
  }
</style>