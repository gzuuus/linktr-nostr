<script lang="ts">
  export let userPub: string;
  
  import ndk from '$lib/stores/provider';
  import type { NDKUser, NDKUserProfile } from "@nostr-dev-kit/ndk";
  import { fade } from 'svelte/transition';
  import { truncateString, copyToClipboard } from '$lib/utils/helpers';
  import CopyIcon from '$lib/elements/icons/copy-icon.svelte';
  import QRcode from 'qrcode-generator';
  import LnIcon from '$lib/elements/icons/ln-icon.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ProfileIcon from '$lib/elements/icons/profile-icon.svelte';
  import { userProfileStore } from '$lib/stores/usersPubs';

  let userProfile: NDKUserProfile;
  let qrImageUrl: string = '';
  let showAbout: boolean = false;
  let user: NDKUser;

  async function fetchUserProfile() {
    const storedProfile = $userProfileStore[userPub];
    if (storedProfile) {
      userProfile = storedProfile;
    } else {
      user = $ndk.getUser({
        npub: userPub,
      });
      await user.fetchProfile();
      userProfile = user.profile as NDKUserProfile;
      $userProfileStore[userPub] = userProfile;
    }
  }

  function generateQRCode(value: string) {
    let qr = QRcode(0, 'L');
    qr.addData(value);
    qr.make();
    qrImageUrl = qr.createDataURL();
    return qrImageUrl;
  }

  import { onMount, afterUpdate } from 'svelte';

  onMount(fetchUserProfile);
  afterUpdate(fetchUserProfile);
</script>

{#if userProfile}
<div transition:fade class="profileContainer">

  {#if userProfile.image != undefined}
    <img transition:fade src={userProfile.image} alt="avatar" />
  {:else}
    <img transition:fade src={generateQRCode(`${$page.url.origin}/${userPub}`)} alt="QR Code" />
  {/if}
 
  <div class="profileInfoBox">
    <h3>{userProfile.name ? userProfile.name : userProfile.displayName}</h3>
    <div class="profileButtons">
      <div><button class="userPubString" on:click={() =>copyToClipboard(userPub)}>{truncateString(userPub)}<CopyIcon size={14} /></button></div>
        <button on:click={() => goto(`${$page.url.origin}/${userPub}`)}><ProfileIcon size={18} /></button>
        {#if userProfile.lud16}
        <a href="lightning:{userProfile.lud16}"><button><LnIcon size={18} /></button></a>
        {/if}
    </div>
    {#if showAbout}
        <p>{userProfile.about}</p>
    {/if}
  </div>
</div>
{/if}

<style>
  .profileContainer {
    margin: 10px;
    border-radius: 15px;
    word-wrap: anywhere;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  img {
    max-width: 75px;
    border-radius: 15px;
  }
  button {
    margin: 0;
    padding: 0;
    display: inline-flex;
    background: transparent;
    cursor: pointer;
    color: var(--accent-color);
  }
  button:hover{
    color: var(--hover-color);
  }
  .userPubString {
    border: none;
    gap: 5px;
    font-size: 16px;
    align-items: start;
    padding: 0.3em 0;
  }
  .profileButtons {
    text-align: start;
  }
  .profileInfoBox {
    display: flex;
    flex-direction: column;
    align-items: start;
    line-height: 1em;
  }
</style>