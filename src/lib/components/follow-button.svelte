<script lang="ts">
  import { activeUser } from "$lib/stores/provider";
  import nostrClient from "$lib/stores/provider";
  import type { NostrUser } from "$lib/nostr/client";
  import { getModalStore, getToastStore, popup } from "$lib/ui";
  import { NostrEvent, type NostrTag } from "$lib/nostr/client";
  import { autoLoginHandler, unixTimeNow } from "$lib/utils/helpers";
  import FollowIcon from "$lib/elements/icons/follow-icon.svelte";
  import { errorPublishToast, toastTimeOut } from "$lib/utils/constants";
  import UnfollowIcon from "$lib/elements/icons/unfollow-icon.svelte";
  import { nip19 } from "nostr-tools";
  import PlainCheckIcon from "$lib/elements/icons/plain-check-icon.svelte";
  import { localStore } from "$lib/stores/stores";
  export let userPub: string;

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  if (userPub.startsWith("npub")) userPub = nip19.decode(userPub).data.toString();
  let user = $nostrClient.getUser({
    pubkey: userPub,
  });

  async function handleFollow() {
    modalStore.trigger({ type: "component", component: "modalLoading" });
    if (!$nostrClient.signer) await autoLoginHandler();
    if (!$nostrClient.signer) return;
    try {
      const followResult = await $activeUser?.follow(user);
      if (followResult) {
        modalStore.close();
        toastStore.trigger({ message: "Followed!", timeout: toastTimeOut, background: "variant-filled-success" });
        const followsSet = await $activeUser?.follows();
        console.log(followsSet);
        const followsArray = Array.from(followsSet as Set<NostrUser>);
        $localStore.currentUserFollows = followsArray.map((user) => user.pubkey);
      } else {
        modalStore.close();
        toastStore.trigger(errorPublishToast);
      }
    } catch (error) {
      modalStore.close();
      toastStore.trigger(errorPublishToast);
    }
  }

  async function handleUnfollow() {
    modalStore.trigger({ type: "component", component: "modalLoading" });
    const newFollowsArray = $localStore.currentUserFollows?.filter((pubkey) => pubkey !== user.pubkey);
    const tags: NostrTag[] = newFollowsArray.map((pubkey) => ["p", pubkey] as NostrTag);
    const event = new NostrEvent($nostrClient, {
      pubkey: $activeUser!.pubkey,
      kind: 3,
      tags: tags,
      created_at: unixTimeNow(),
      content: "",
    });
    if (!$nostrClient.signer) await autoLoginHandler();
    if (!$nostrClient.signer) return;
    try {
      await event.publish();
      $localStore.currentUserFollows = newFollowsArray;
      toastStore.trigger({ message: "Unfollowed", timeout: toastTimeOut, background: "variant-filled-success" });
      modalStore.close();
    } catch (error) {
      console.log(error);
      modalStore.close();
      toastStore.trigger(errorPublishToast);
    }
  }

  let isHover: boolean = false;
</script>

{#key user.pubkey}
  {#if $activeUser}
    {#if $localStore.currentUserFollows.includes(user.pubkey)}
      <button
        on:click={handleUnfollow}
        on:mouseenter={() => (isHover = true)}
        on:mouseleave={() => (isHover = false)}
        use:popup={{ event: "hover", target: "popup", placement: "top" }}
        class="p-1 rounded-full {isHover ? 'variant-soft-error' : 'variant-soft-success'}"
      >
        {#if isHover}
          <UnfollowIcon size={18} />
        {:else}
          <PlainCheckIcon size={18} />
        {/if}
      </button>
      <div class="card p-4 variant-filled min-w-[200px] z-50" data-popup="popup">
        <p>You already follow this user. Click to unfollow</p>
        <div class="arrow variant-filled"></div>
      </div>
    {:else}
      <button on:click={handleFollow} class="p-1 rounded-full variant-soft hover:variant-soft-success">
        <FollowIcon size={18} />
      </button>
    {/if}
  {/if}
{/key}
