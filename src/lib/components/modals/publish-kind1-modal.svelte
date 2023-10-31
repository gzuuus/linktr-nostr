<script lang="ts">
    import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from "$lib/stores/provider";
	import { getModalStore } from '@skeletonlabs/skeleton';
    import { ndkUser } from '$lib/stores/user';
    import Login from '../login.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { succesPublishToast, errorPublishToast } from '$lib/utils/constants';

	export let parent: any;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const formData = {
		eventContent: $modalStore[0].meta.noteContent
	};
	function onFormSubmit(): void {
		const ndkEvent = new NDKEvent($ndk);
		ndkEvent.kind = 1;
		ndkEvent.content = formData.eventContent;
		ndkEvent.tags=[
		["t", "nostree"],
		]
		ndkEvent
		.publish()
		.then(() => {
				toastStore.trigger(succesPublishToast)
				modalStore.close()
			}
		)
		.catch((error) => {
			toastStore.trigger(errorPublishToast)
			console.log("Error:", error);
		})
	}
</script>

{#if $modalStore[0]}
	<div class="common-modal-base">
		<header class="common-2xl-header">Share: {$modalStore[0].title ?? '(title missing)'}</header>
		<form class="border border-surface-500 p-6 space-y-4 rounded-container-token">
			<label class="label break-words">
				<span>{$modalStore[0].body ?? '(body missing)'}</span>
				<textarea class="textarea" rows="4" bind:value={formData.eventContent} placeholder="Enter some text..." />
			</label>
		</form>

		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		{#if $ndkUser}
		<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Share</button>
		{:else}
		<Login doGoto={false}/>
		{/if}
    	</footer>
	</div>
{/if}