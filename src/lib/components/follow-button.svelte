<script lang="ts">
    import { ndkUser } from "$lib/stores/user";
    import { currentUserFollows } from "$lib/stores/user";
    import ndk from "$lib/stores/provider";
    import type { NDKUser } from "@nostr-dev-kit/ndk";
    import { getModalStore, getToastStore, popup, type ToastSettings } from "@skeletonlabs/skeleton";
    import { NDKEvent, NDKKind, NDKNip07Signer, type NDKTag } from "@nostr-dev-kit/ndk";
    import { unixTimeNow } from "$lib/utils/helpers";
    import FollowIcon from "$lib/elements/icons/follow-icon.svelte";
    import { toastTimeOut } from "$lib/utils/constants";
    import UnfollowIcon from "$lib/elements/icons/unfollow-icon.svelte";
    import { nip19 } from "nostr-tools";
    import PlainCheckIcon from "$lib/elements/icons/plain-check-icon.svelte";
    export let userPub: string;

    const toastStore = getToastStore();
    const modalStore = getModalStore();

    if (userPub.startsWith("npub")) userPub = nip19.decode(userPub).data.toString();
    let user = $ndk.getUser({
      pubkey: userPub,
    });
    
    async function handleFollow() {
        modalStore.trigger({ type: 'component', component: 'modalLoading',});
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        const followResult = await $ndkUser?.follow(user);
        console.log(followResult);
        if (followResult) {
            modalStore.close();
            toastStore.trigger({message: "Followed!", timeout: toastTimeOut, background: "variant-filled-success"});
            const followsSet = await $ndkUser?.follows();
            console.log(followsSet);
            const followsArray = Array.from(followsSet as Set<NDKUser>);
            $currentUserFollows = followsArray.map((user) => user.pubkey);
        } else {
            modalStore.close();
            toastStore.trigger({message: "Already following", timeout: toastTimeOut, background: "variant-filled-success"});
        }
    }

    async function handleUnfollow() {
        modalStore.trigger({ type: 'component', component: 'modalLoading',});
        const newFollowsArray = $currentUserFollows.filter((pubkey) => pubkey !== user.pubkey);
        const tags: NDKTag[] = newFollowsArray.map((pubkey) => ["p", pubkey] as NDKTag);

        const event = new NDKEvent($ndk, {
            pubkey: $ndkUser!.pubkey,
            kind: NDKKind.Contacts,
            tags: tags,
            created_at: unixTimeNow(),
            content: "",
        });

        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        try {
            await event.publish()
            $currentUserFollows = newFollowsArray;
            toastStore.trigger({message: "Unfollowed", timeout: toastTimeOut, background: "variant-filled-success"});
            modalStore.close();
        } catch (error) {
            console.log(error);
            modalStore.close();
            toastStore.trigger({message: "Error", timeout: toastTimeOut, background: "variant-filled-error"});
        }

    }
    let isHover: boolean = false;
</script>

{#key user.pubkey}
    {#if $ndkUser}
        {#if $currentUserFollows.includes(user.pubkey)}
            <button
                on:click={handleUnfollow}
                on:mouseenter={() => (isHover = true)}
                on:mouseleave={() => (isHover = false)}
                class="p-1 rounded-full {isHover ? 'variant-soft-error' :'variant-soft-success' }"
            >
            {#if isHover}
                <UnfollowIcon size={18}/>
            {:else}
                <PlainCheckIcon size={18}/>
            {/if}   
            </button>
        {:else}
            <button
                on:click={handleFollow}
                class="p-1 rounded-full  variant-soft hover:variant-soft-success"
            >
                <FollowIcon size={18}/>
            </button>
        {/if}
    {:else}
        <button disabled class="p-1 rounded-full " use:popup={{ event: 'hover', target: 'popupHover', placement: 'top' }}>
            <FollowIcon size={18}/>
        </button>
        <div class="card p-4 variant-filled" data-popup="popupHover">
            <p>Login to follow</p>
            <div class="arrow variant-filled" />
        </div>
    {/if}
{/key}