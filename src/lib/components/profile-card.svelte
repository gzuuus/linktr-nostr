<script lang="ts">
  export let userPub: string;
  export let userProfile: NDKUserProfile | null;
  import ndk from "$lib/stores/provider";
  import type { NDKUserProfile } from "@nostr-dev-kit/ndk";
  import { truncateString, copyToClipboard, sharePage } from "$lib/utils/helpers";
  import CopyIcon from "$lib/elements/icons/copy-icon.svelte";
  import QRcode from "qrcode-generator";
  import QrIcon from "$lib/elements/icons/qr-icon.svelte";
  import LnIcon from "$lib/elements/icons/ln-icon.svelte";
  import { page } from "$app/stores";
  import InfoIcon from "$lib/elements/icons/info-icon.svelte";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
  import AtIcon from "$lib/elements/icons/at-icon.svelte";
  import { isNip05Valid } from "$lib/utils/helpers";
  import { isNip05Valid as isNip05ValidStore } from "$lib/stores/user";
  import LinktOut from "$lib/elements/icons/linkt-out.svelte";
  import OstrichIcon from "$lib/elements/icons/ostrich-icon.svelte";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import Logo from "$lib/elements/icons/logo.svelte";
    import { CORSproxyUrl, outNostrLinksUrl } from "$lib/utils/constants";

  let qrImageUrl: string = "";
  let showQR: boolean = false;
  let showAbout: boolean = false;

  let user = $ndk.getUser({
    npub: userPub,
  });
  async function fetchUserProfile() {
    await user
      .fetchProfile({
        closeOnEose: true,
        cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
        groupable: false,
      })
      .then(() => {
        userProfile = user.profile as NDKUserProfile;
        isNip05Valid(user.profile?.nip05, user.npub);
        if (userProfile.image == undefined) {
          generateQRCode(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`);
        }
      });
  }

  function generateQRCode(value: string) {
    let qr = QRcode(0, "L");
    qr.addData(value);
    qr.make();
    showQR = !showQR;
    return (qrImageUrl = qr.createDataURL());
  }
  function handleMoreInfo() {
    showAbout = !showAbout;
  }
  let isSharePossible: boolean =
    typeof navigator !== "undefined" && "share" in navigator && typeof navigator.share === "function";
</script>

{#await fetchUserProfile()}
  <div class="profileContainer">
    <a class="text-color" href="{$page.url.origin}/{$isNip05ValidStore.UserIdentifier}">
      <div class="loading-global"><Logo size={50}/></div>
    </a>
    <h2>Loading Profile...</h2>
  </div>
{:then value}
  {#if userProfile}
    <div class="profileContainer">
      <a class="text-color" href="{$page.url.origin}/{$isNip05ValidStore.UserIdentifier}">
        <img class={showQR ? 'hidden' : ''} src={userProfile.image ? CORSproxyUrl + encodeURIComponent(userProfile.image) : ''} alt="avatar" />
        <img class="qrImage {showQR ? '' : 'hidden'}" src={qrImageUrl} alt="QR Code" />
      </a>
      <div class="profileInfoBox">
        <button on:click={() => generateQRCode(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`)}
          ><QrIcon size={18} /></button
        >
        <a href="lightning:{userProfile.lud16}"><button><LnIcon size={18} /></button></a>
        <button class:hidden={!isSharePossible} on:click={() => sharePage(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`)}
          ><ShareIcon size={16} /></button
        >
        <button class:hidden={isSharePossible} on:click={() => copyToClipboard(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`)}
          ><ShareIcon size={16} /></button
        >
        <h2>
          <a class="text-color" href="{$page.url.origin}/{$isNip05ValidStore.UserIdentifier}"
            >{userProfile.name ? userProfile.name : userProfile.displayName}</a
          >
        </h2>

        <div class="userInfoString">
          <button
            class="userPubButton"
            on:click={() => copyToClipboard(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`)}
          >
            {#if !$isNip05ValidStore.isNip05Valid}
              <AtIcon size={16} />
            {/if}
            <code
              >{$isNip05ValidStore.isNip05Valid
                ? userProfile.nip05
                  ? userProfile.nip05
                  : $isNip05ValidStore.Nip05address
                : truncateString(userPub)}</code
            >
          </button>
        </div>

        <button on:click={() => handleMoreInfo()}><InfoIcon size={16} /></button>
        {#if showAbout}
          <div>
            <button class="userInfoString" on:click={() => copyToClipboard(userPub)}
              >{truncateString(userPub)}<CopyIcon size={14} /></button
            >
          </div>
          <p>{userProfile.about ? userProfile.about : ""}</p>
          <div class="userInfoString" style="flex-direction:column;">
            <a href="{outNostrLinksUrl}/{userPub}" target="_blank" rel="noreferrer"><button class="inline-span" style="gap: 0.3em; padding: 0.2em 0.3em;">See in nostr client <LinktOut size={18} /></button></a>
            <a href="nostr:{userPub}"><button class="inline-span" style="gap: 0.3em; padding: 0.2em 0.3em;">See in native client <OstrichIcon size={18} /></button></a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/await}

<style>
  @import '$lib/elements/animations/general-animations.css';
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
  button:hover {
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
