<script lang="ts">
  export let userPub: string;
  import ndk from '$lib/stores/provider';
  import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
  import { fade } from 'svelte/transition';
  import { truncateString, copyToClipboard} from '$lib/utils/helpers';
  import CopyIcon from '$lib/elements/icons/copy-icon.svelte';
  import QRcode from 'qrcode-generator';
  import QrIcon from '$lib/elements/icons/qr-icon.svelte';
  import LnIcon from '$lib/elements/icons/ln-icon.svelte';
  import { page } from '$app/stores';
  import { Tag } from 'agnostic-svelte';
  import CheckIcon from '$lib/elements/icons/check-icon.svelte';
  import InfoIcon from '$lib/elements/icons/info-icon.svelte';
    
  let userProfile: NDKUserProfile;
  let qrImageUrl: string = '';
  let showQR: boolean = false;
  let showAbout: boolean = false;

  let user = $ndk.getUser({
    npub: userPub,
  });

  user.fetchProfile().then(() => {
  userProfile = user.profile as NDKUserProfile;}).then(() => {
    if (userProfile.image == undefined) {
      generateQRCode($page.url.href);
    }
})

  function generateQRCode(value:string) {
    let qr = QRcode(0, 'L');
    qr.addData(value);
    qr.make();
    qrImageUrl = qr.createDataURL();
    showQR = !showQR;
  }
  function handleMoreInfo() {
    showAbout = !showAbout;
  }

</script>

{#if userProfile}
<div transition:fade class="profileContainer">
      <img class="pfp {showQR ? 'hidden' : ''}" src={userProfile.image} alt="avatar" />
      <img class="pfp {showQR ? '' : 'hidden'}" src={qrImageUrl} alt="QR Code" />
  <div class="profileInfoBox">
    <h2>{userProfile.name ? userProfile.name : userProfile.displayName}</h2>
    {#if userProfile.nip05}
      <Tag><CheckIcon size={14} />{userProfile.nip05}</Tag>
    {/if}
    <div class="profileButtons">
      <div><button class="userPubString" on:click={() =>copyToClipboard(userPub)}>{truncateString(userPub)}<CopyIcon size={14} /></button></div>
      <div>
        <button on:click={() =>generateQRCode($page.url.href)}><QrIcon size={18} /></button>
        <a href="lightning:{userProfile.lud16}"><button><LnIcon size={18} /></button></a>
        {#if userProfile.about}
        <button on:click={() =>handleMoreInfo()}><InfoIcon size={18} /></button>
        {/if}
      </div>
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
  }
  img {
    max-width: 140px;
    border-radius: 15px;
  }
  button {
    margin: 0;
    display: inline-flex;
    background: transparent;

    cursor: pointer;
    color: var(--accent-color);
  }
  button:hover{
    color: var(--hover-color);
  }
  button {
    padding: 0.3em;
    border: var(--common-border-style);
  }
  .userPubString {
    border: none;
    gap: 5px;
    font-size: 16px;
    align-items: center;
    padding: 0.3em 0;
  }
  .profileButtons {
    margin-bottom: 0.5em;
  }
</style>