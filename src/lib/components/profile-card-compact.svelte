<script lang="ts">
  export let userPub: string;
  import ndk from "$lib/stores/provider";
  import { fade } from "svelte/transition";
  import { truncateString} from "$lib/utils/helpers";
  import QRcode from "qrcode-generator";
  import LnIcon from "$lib/elements/icons/ln-icon.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import QrIcon from "$lib/elements/icons/qr-icon.svelte";
    import { CORSproxyUrl } from "$lib/utils/constants";
    import PlaceHolderLoading from "./placeHolderLoading.svelte";
    import { Avatar } from "@skeletonlabs/skeleton";
    import ClipboardButton from "./clipboardButton.svelte";

  let qrImageUrl: string = "";
  let showQR: boolean = false;

  $: user = $ndk.getUser({ npub: userPub });
  function generateQRCode(value: string) {
    let qr = QRcode(0, "L");
    qr.addData(value);
    qr.make();
    showQR = !showQR;
    qrImageUrl = qr.createDataURL();
    return qrImageUrl;
  }
</script>


  {#await user?.fetchProfile( { closeOnEose: true, cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST, groupable: true } )}
  <div class="flex gap-2">
    <PlaceHolderLoading layoutKind={"avatar"} logoSize={40} />
    <PlaceHolderLoading colCount={2} listItemPadding={"py-2"} />
  </div>
  {:then value}
  <div transition:fade class="flex gap-2 text-left justify-start items-center">
  <a href="/{userPub}">
    <Avatar class={showQR ? 'hidden' : 'common-ring'}
    src={user?.profile?.image ? user.profile.image : ''}
    width="w-16"
    alt="avatar"
    />
    <Avatar class="{showQR ? 'common-ring' : 'hidden'}" 
    src={qrImageUrl} 
    width="w-32" 
    alt="QR Code"
    />
  </a>
    <div class="flex flex-col gap-1">
        <h3><a href="/{userPub}">{user?.profile?.name ? user?.profile?.name : user?.profile?.displayName}</a></h3>
      <span class="common-badge-soft w-fit">
        <ClipboardButton 
          contentToCopy={`${$page.url.origin}/${userPub}`} 
          buttonText={user?.profile?.nip05 ? user?.profile?.nip05 : truncateString(userPub)}
          isButton={false}
          buttonIcon="none"
        />
      </span>
      <div class="inline-flex gap-2 w-fit">
        <button on:click={() => goto(`/${userPub}`)}><ProfileIcon size={16} /></button>
        {#if user?.profile?.lud16}
          <a href="lightning:{user?.profile?.lud16}"><LnIcon size={16} /></a>
        {/if}
        <button on:click={() => generateQRCode(`${$page.url.origin}/${userPub}`)}
          ><QrIcon size={16} /></button
        >
      </div>
    </div>
  </div>
  {/await}


<!-- <style>
  .avatar {
    max-width: 85px;
    border-radius: var(--agnostic-radius);
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
  button:hover {
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
  .qrImage {
    width: 120px;
    max-width: unset !important;
    animation: fadeIn 0.3s ease-in-out;
  }

</style> -->
