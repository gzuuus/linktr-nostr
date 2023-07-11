<script lang="ts">
    export let userPub: string;
    import ndk from '$lib/stores/provider';
    import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
    
    let userProfile: NDKUserProfile;
    
    const user = $ndk.getUser({
             npub: userPub,
         });
    user.fetchProfile().then(() => {
             userProfile = user.profile as NDKUserProfile;
             console.log(userProfile);
         })

</script>

<div class="profileContainer">
  <div>
    {#if userProfile}
    <img src={userProfile.image} alt="avatar"/>
    <h2>{userProfile.name}</h2>
    <p>{userProfile.about}</p>
    <div class="p_btnContainer">
    </div>
  {/if}
  </div>
</div>


<style>
  .profileContainer {
    margin: 10px;
    border-radius: 15px;
    word-wrap: anywhere;
    /* background: var(--elements-b-color); */
  }
  img {
    max-width: 160px;
    border-radius: 15px;
  }
  .p_btnContainer {
    display: flex;
    justify-content: center;
  }

</style>