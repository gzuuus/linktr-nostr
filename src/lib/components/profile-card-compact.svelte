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
  import PlaceHolderLoading from "./placeHolderLoading.svelte";
  import { Avatar } from "@skeletonlabs/skeleton";
  import ClipboardButton from "./clipboard-button.svelte";

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

  {#await user?.fetchProfile( { closeOnEose: true, groupable:true} )}
  <div class="flex gap-2">
    <PlaceHolderLoading layoutKind={"avatar"} logoSize={40} />
    <PlaceHolderLoading colCount={2} listItemPadding={"py-2"} />
  </div>
  {:then value}
  <div transition:fade class="flex gap-2 text-left justify-start items-center flex-wrap">
  <a href="/{userPub}">
    <Avatar class={showQR ? 'hidden' : 'common-ring'}
    border="border-2 border-surface-300-600-token hover:!border-primary-500"
    cursor="cursor-pointer"
    initials={user?.profile?.name ? user?.profile?.name : user?.profile?.displayName}
    src={user?.profile?.image ? user.profile.image : ''} 
    width="w-16"
    fallback={qrImageUrl}
    alt={user?.profile?.name ? user?.profile?.name : user?.profile?.displayName}
    />
    <Avatar class="{showQR ? 'common-ring' : 'hidden'}" 
    border="border-4 border-surface-300-600-token hover:!border-primary-500"
    cursor="cursor-pointer"
    src={qrImageUrl} 
    width="w-32"
    rounded="rounded-3xl"
    alt="QR Code"
    />
  </a>
    <div class="flex flex-col gap-1">
      <a class="no-underline text-base font-bold" href="/{userPub}">{user?.profile?.name ? user?.profile?.name : user?.profile?.displayName}</a>
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
