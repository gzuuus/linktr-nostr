<script lang="ts">
    import { ndkActiveUser } from "$lib/stores/provider";
    import ndk from "$lib/stores/provider";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { getModalStore, getToastStore, popup} from "@skeletonlabs/skeleton";
    import { NDKEvent, NDKKind, type NDKTag } from "@nostr-dev-kit/ndk";
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
    let user = $ndk.getUser({
      pubkey: userPub,
    });
    
    async function handleFollow() {
        modalStore.trigger({ type: 'component', component: 'modalLoading',});
        if (!$ndk.signer) await autoLoginHandler()
        if (!$ndk.signer) return;
        try {
        const followResult = await $ndkActiveUser?.follow(user);
        if (followResult) {
            modalStore.close();
            toastStore.trigger({message: "Followed!", timeout: toastTimeOut, background: "variant-filled-success"});
            const followsSet = await $ndkActiveUser?.follows();
            console.log(followsSet);
            const followsArray = Array.from(followsSet as Set<NDKUser>);
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
        modalStore.trigger({ type: 'component', component: 'modalLoading',});
        const newFollowsArray = $localStore.currentUserFollows?.filter((pubkey) => pubkey !== user.pubkey);
        const tags: NDKTag[] = newFollowsArray.map((pubkey) => ["p", pubkey] as NDKTag);
        const event = new NDKEvent($ndk, {
            pubkey: $ndkActiveUser!.pubkey,
            kind: NDKKind.Contacts,
            tags: tags,
            created_at: unixTimeNow(),
            content: "",
        });
        if (!$ndk.signer) await autoLoginHandler()
        if (!$ndk.signer) return;
        try {
            await event.publish()
            $localStore.currentUserFollows = newFollowsArray;
            toastStore.trigger({message: "Unfollowed", timeout: toastTimeOut, background: "variant-filled-success"});
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
    {#if $ndkActiveUser}
        {#if $localStore.currentUserFollows.includes(user.pubkey)}
            <button
                on:click={handleUnfollow}
                on:mouseenter={() => (isHover = true)}
                on:mouseleave={() => (isHover = false)}
                use:popup={{ event: 'hover', target: 'popup', placement: 'top' }}
                class="p-1 rounded-full {isHover ? 'variant-soft-error' :'variant-soft-success' }"
            >
            {#if isHover}
                <UnfollowIcon size={18}/>
            {:else}
                <PlainCheckIcon size={18}/>
            {/if}
            </button>
            <div class="card p-4 variant-filled min-w-[200px] z-50" data-popup="popup">
                <p>You already follow this user. Click to unfollow</p>
                <div class="arrow variant-filled" />
            </div> 
        {:else}
            <button
                on:click={handleFollow}
                class="p-1 rounded-full  variant-soft hover:variant-soft-success"
            >
                <FollowIcon size={18}/>
            </button>
        {/if}
    {/if}
{/key}