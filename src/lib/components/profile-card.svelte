<script lang="ts">
  export let userPub: string;
  export let userProfile: NDKUserProfile | undefined = undefined;
  import ndk from "$lib/stores/provider";
  import type { NDKFilter, NDKKind, NDKUserProfile } from "@nostr-dev-kit/ndk";
  import { ndkUser } from "$lib/stores/user";
  import { truncateString, sharePage, setCustomStyles, fetchUserProfile } from "$lib/utils/helpers";
  import QRcode from "qrcode-generator";
  import QrIcon from "$lib/elements/icons/qr-icon.svelte";
  import LnIcon from "$lib/elements/icons/ln-icon.svelte";
  import { page } from "$app/stores";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
  import { isNip05Valid } from "$lib/utils/helpers";
  import { isNip05Valid as isNip05ValidStore, userCustomTheme } from "$lib/stores/user";
  import LinkOut from "$lib/elements/icons/link-out.svelte";
  import OstrichIcon from "$lib/elements/icons/ostrich-icon.svelte";
  import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
  import { defaulTheme, kindCSSReplaceableAsset, outNostrLinksUrl } from "$lib/utils/constants";
  import { Avatar } from '@skeletonlabs/skeleton';
  import PlaceHolderLoading from "./placeHolderLoading.svelte";
  import ClipboardButton from "./clipboard-button.svelte";
  import ParseContent from "./parse-content.svelte";
  import ChevronIconVertical from "$lib/elements/icons/chevron-icon-vertical.svelte";
  import { storeTheme } from '$lib/stores/stores';
  import { onDestroy } from "svelte";
  import { nip19 } from "nostr-tools";
    import { debounce } from "debounce";

  let qrImageUrl: string = "";
  let showQR: boolean = false;
  let showAbout: boolean = false;
  let userNpub: string = nip19.npubEncode(userPub);

  async function fetchUser() {
      fetchUserProfile(userPub)
      .then((user) => {
        userProfile = user;
        isNip05Valid(user?.nip05, user?.npub);
      }).finally(() => {
      if (userPub != $ndkUser?.pubkey){
        fetchCssAsset()
      }}
      );
  }

  async function fetchCssAsset() {
    let ndkFilter: NDKFilter = {
      authors: [userPub], 
      kinds: [kindCSSReplaceableAsset as NDKKind], 
      "#L": ["nostree-theme"]
    };
    await $ndk
      .fetchEvent(ndkFilter, {
        closeOnEose: true,
        groupable: true,
        cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
      })
      .then((fetchedEvent) => {
          const userTheme = fetchedEvent?.tagValue('l');
          if (fetchedEvent){
          if (fetchedEvent?.content){
            setCustomStyles(fetchedEvent.content);
          }
          storeTheme.set(userTheme || '');
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

  async function handleShareClick(urlToShare: string) {
    const shared = await sharePage(urlToShare);
  }

  onDestroy(() => {
	storeTheme.set($userCustomTheme.UserTheme ? $userCustomTheme.UserTheme : defaulTheme);
});
</script>
{#await fetchUser()}
<div class="w-fit m-auto">
    <PlaceHolderLoading layoutKind={"avatar"} />
</div>
{:then value}
  {#if userProfile}
      <div class="mx-auto w-fit flex flex-col gap-2">
      <a class="text-color" href="{$page.url.origin}/{$isNip05ValidStore.UserIdentifier}">
        <Avatar class={showQR ? 'hidden' : 'common-ring'}
        border="border-2 border-surface-300-600-token"
        initials={userProfile.name ? userProfile.name : $isNip05ValidStore.UserIdentifier}
        src={userProfile.image} 
        width="w-32"
        fallback={qrImageUrl}
        alt={$isNip05ValidStore.UserIdentifier}
        />
        <Avatar class="{showQR ? 'common-ring' : 'hidden'}" 
        src={qrImageUrl} 
        width="w-32"
        rounded="rounded-3xl"
        alt="QR Code"
        />
      </a>
      <div>
      <button class="common-btn-icon-ghost" on:click={() => generateQRCode(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`)}
        ><QrIcon size={16} /></button
      >
      <a href="lightning:{userProfile.lud16}"><button class="common-btn-icon-ghost"><LnIcon size={16} /></button></a>
      <button class="common-btn-icon-ghost" on:click={() =>  handleShareClick(`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`)}
        ><ShareIcon size={16} /></button
      >
    </div>
    </div>
      <div class="flex flex-col gap-2">
        <h1>
          <a class="no-underline" href="{$page.url.origin}/{$isNip05ValidStore.UserIdentifier}"
            >{userProfile.displayName ? userProfile.displayName : userProfile.name}</a
          >
        </h1>

        <div>
          <span class="common-badge-soft">
          <ClipboardButton contentToCopy={`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}`} buttonText={$isNip05ValidStore.isNip05Valid
            ? userProfile.nip05
              ? userProfile.nip05
              : $isNip05ValidStore.Nip05address
            : truncateString(userPub)} 
            isButton={false}
            buttonIcon="none"
            />
          <button on:click={() => showAbout = !showAbout}><ChevronIconVertical flipVertical={!showAbout} size={16} /></button>
          </span>
        </div>
        {#if showAbout}
        <div class="flex flex-col gap-2 justify-center items-center card p-2">
          <span class="common-badge-soft w-fit">
            <ClipboardButton contentToCopy={userNpub} buttonText={truncateString(userNpub)}
              isButton={false}
              />
          </span>
          {#if userProfile.about }
            <ParseContent content={userProfile.about} charLimit={300}/>
          {/if}
          <div class="flex gap-2 flex-wrap justify-center">
            <a href="{outNostrLinksUrl}/{userNpub}" target="_blank" rel="noreferrer"><span class="common-badge-ghost gap-2">View profile in nostr <LinkOut size={18} /></span></a>
            <a href="nostr:{userNpub}"><span class="common-badge-ghost gap-2">View profile in native client <OstrichIcon size={18} /></span></a>
          </div>
      </div>
        {/if}
      </div>
  {/if}
{/await}
