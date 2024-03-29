<script lang="ts">
    import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from "$lib/stores/provider";
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { ndkActiveUser } from '$lib/stores/provider';
	import Login from '../login.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { succesPublishToast, errorPublishToast } from '$lib/utils/constants';
	export let parent: any;
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const formData = {
		eventContent: $modalStore[0].meta.noteContent
	};
	async function onFormSubmit(): Promise<void> {
		if (!$ndk.signer) return
		modalStore.close();
		modalStore.trigger({ type: 'component', component: 'modalLoading'});
		const ndkEvent = new NDKEvent($ndk);
		ndkEvent.kind = 1;
		ndkEvent.content = formData.eventContent;
		ndkEvent.tags=[
		["t", "nostree"],
		]
		ndkEvent
		.publish()
		.then(() => {
				modalStore.clear();
				toastStore.trigger(succesPublishToast)
			}
		)
		.catch((error) => {
			modalStore.clear();
			toastStore.trigger(errorPublishToast)
			console.log("Error:", error);
		})
	}
</script>

{#if $modalStore[0]}
	<div class="common-modal-base">
		<header class="common-2xl-header">Share: {$modalStore[0].title ?? '(title missing)'}</header>
		<form on:submit|preventDefault={onFormSubmit} class="border border-surface-500 p-6 space-y-4 rounded-container-token">
			<label class="label break-words">
				<span>{$modalStore[0].body ?? '(body missing)'}</span>
				<textarea class="textarea" rows="4" bind:value={formData.eventContent} placeholder="Enter some text..." />
			</label>
			<footer class="modal-footer {parent.regionFooter}">
				<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
				{#if $ndkActiveUser}
				<button type="submit" class="btn {parent.buttonPositive}">Share</button>
				{:else}
				<Login doGoto={false}/>
				{/if}
				</footer>
		</form>


	</div>
{/if}