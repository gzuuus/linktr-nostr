<script lang="ts">
  export let userPub: string;
  import ndk from '$lib/stores/provider';
  import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
  import { truncateString, copyToClipboard, sharePage} from '$lib/utils/helpers';
  import CopyIcon from '$lib/elements/icons/copy-icon.svelte';
  import QRcode from 'qrcode-generator';
  import QrIcon from '$lib/elements/icons/qr-icon.svelte';
  import LnIcon from '$lib/elements/icons/ln-icon.svelte';
  import { page } from '$app/stores';
  import InfoIcon from '$lib/elements/icons/info-icon.svelte';
  import ShareIcon from '$lib/elements/icons/share-icon.svelte';
  import AtIcon from '$lib/elements/icons/at-icon.svelte';
    
  let userProfile: NDKUserProfile;
  let qrImageUrl: string = '';
  let showQR: boolean = false;
  let showAbout: boolean = false;
  let fetchProfilePromise: Promise<void>;
    
  let user = $ndk.getUser({
    npub: userPub,
  })

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
  let isSharePossible:boolean= typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function';
</script>

{#if userProfile}
<div class="profileContainer">
      <img class=" {showQR ? 'hidden' : ''}" src={userProfile.image} alt="avatar" />
      <img class="qrImage {showQR ? '' : 'hidden'}" src={qrImageUrl} alt="QR Code" />
  <div class="profileInfoBox">
    <button on:click={() =>generateQRCode($page.url.href)}><QrIcon size={18} /></button>
    <a href="lightning:{userProfile.lud16}"><button><LnIcon size={18} /></button></a>
    <button class:hidden={!isSharePossible} on:click={() =>sharePage($page.url.href)}><ShareIcon size={16} /></button>
    <h2>{userProfile.name ? userProfile.name : userProfile.displayName}</h2>
    {#if userProfile.nip05}
      <div class="userInfoString">
        <button class="userPubButton" on:click={() =>copyToClipboard(`${$page.url.origin}/${userProfile.nip05}`)}><AtIcon size={16} />
          <code >{userProfile.nip05} </code>
        </button>
      </div>
    {/if}
    <button  on:click={() =>handleMoreInfo()}><InfoIcon size={16} /></button>
    {#if showAbout}
      <div><button class="userInfoString" on:click={() =>copyToClipboard(userPub)}>{truncateString(userPub)}<CopyIcon size={14} /></button></div>
        <p>{userProfile.about}</p>
    {/if}
  </div>
</div>
{/if}

<style>
  .profileContainer {
    margin: 10px;
    border-radius: var(--agnostic-radius);
    word-wrap: anywhere;
  }
  .userPubButton {
    padding-right: 0.5em;
  }
  img {
    max-width: 125px;
    border-radius: var(--agnostic-radius);
  }
  button {
    margin: 0;
    display: inline-flex;
    background: transparent;
    cursor: pointer;
    color: var(--accent-color);
    padding: 0.2em;
    border: var(--common-border-style);
  }
  button:hover{
    color: var(--hover-color);
  }
  .userInfoString {
    border: none;
    display: inline-flex;
    gap: 5px;
    font-size: 16px;
    align-items: center;
    padding: 0.3em 0;
  }
</style>