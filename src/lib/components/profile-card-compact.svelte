<script lang="ts">
  export let userPub: string;
  import ndk from '$lib/stores/provider';
  import { fade } from 'svelte/transition';
  import { truncateString, copyToClipboard } from '$lib/utils/helpers';
  import CopyIcon from '$lib/elements/icons/copy-icon.svelte';
  import QRcode from 'qrcode-generator';
  import LnIcon from '$lib/elements/icons/ln-icon.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ProfileIcon from '$lib/elements/icons/profile-icon.svelte';
  import Logo from '$lib/elements/icons/logo.svelte';
  let qrImageUrl: string = '';
  let isImageBlocked = false;

  $: user = $ndk.getUser({ npub: userPub });
  function generateQRCode(value: string) {
    let qr = QRcode(0, 'L');
    qr.addData(value);
    qr.make();
    qrImageUrl = qr.createDataURL();
    return qrImageUrl;
  }  


  function handleImageError() {
    isImageBlocked = true;
  }
</script>

<div transition:fade class="profileContainer">

{#await user?.fetchProfile({closeOnEose: true, groupable: true, groupableDelay: 1000})}
    <Logo size={50}/>
    <h3>Loading profile</h3>
{:then value}
    {#if !isImageBlocked}
      <img src={user?.profile?.image??generateQRCode(`${$page.url.origin}/${userPub}`)} alt="Avatar" class="avatar avatar--image {$$props.class}" style={$$props.style} on:error={handleImageError}/>
    {:else}
      <img src={generateQRCode(`${$page.url.origin}/${userPub}`)} alt="QRAvatar" class="avatar avatar--image {$$props.class}" style={$$props.style}/>
    {/if}
    <div class="profileInfoBox">
      <h3>{user?.profile?.name ? user?.profile?.name : user?.profile?.displayName}</h3>
      <div class="profileButtons">
        <div><button class="userPubString" on:click={() =>{user?.profile?.nip05 ? copyToClipboard(user?.profile?.nip05):copyToClipboard(userPub) }}>{user?.profile?.nip05 ? user?.profile?.nip05:truncateString(userPub)}<CopyIcon size={14} /></button></div>
          <button on:click={() => goto(`/${userPub}`)}><ProfileIcon size={18} /></button>
          {#if user?.profile?.lud16}
          <a href="lightning:{user?.profile?.lud16}"><button><LnIcon size={18} /></button></a>
          {/if}
      </div>
    </div>
    {:catch error}
      <img alt="Error loading avatar" class="avatar avatar--error {$$props.class}" style={$$props.style} />
{/await}

</div>
<style>
    .avatar {
    max-width: 75px;
    border-radius: var(--agnostic-radius);
    }

    .avatar--loading {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

  .profileContainer {
    margin: 10px;
    border-radius: var(--agnostic-radius);
    word-wrap: anywhere;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 0.3em;
  }
  button {
    margin: 0;
    padding: 0;
    display: inline-flex;
    background: transparent;
    cursor: pointer;
    color: var(--accent-color);
    align-items: center;
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
    text-align: start;
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