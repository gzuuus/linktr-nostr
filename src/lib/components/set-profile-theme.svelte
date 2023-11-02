<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
	import { succesPublishToast, errorPublishToast, kindCSSAsset } from '$lib/utils/constants';
    import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from "$lib/stores/provider";
	import { getModalStore } from '@skeletonlabs/skeleton';
    import { ndkUser } from '$lib/stores/user';
    import { v4 as uuidv4 } from "uuid";
    const modalStore = getModalStore();
	const toastStore = getToastStore();

    function EventSubmit(): void {
		modalStore.trigger({ type: 'component', component: 'modalLoading'});
		const ndkEvent = new NDKEvent($ndk);
		ndkEvent.kind = kindCSSAsset;
		ndkEvent.content = "";
		ndkEvent.tags=[
        ["d", `nostree-theme-${uuidv4()}`],
		["L", "nostree-theme"],
        ["l", document.body.getAttribute('data-theme')!],
		]
		ndkEvent
		.publish()
		.then(() => {
				modalStore.close()
				toastStore.trigger(succesPublishToast)
			}
		)
		.catch((error) => {
			modalStore.close()
			toastStore.trigger(errorPublishToast)
			console.log("Error:", error);
		})
	}
    // document.body.setAttribute('data-theme', theme)
    
</script>
{#if ndkUser}
<button class="btn variant-filled w-full" on:click={EventSubmit}>
    <span>Use theme in profile</span>
</button>
{/if}