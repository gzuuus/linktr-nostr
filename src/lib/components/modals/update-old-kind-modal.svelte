<script lang="ts">
    import {NDKEvent} from '@nostr-dev-kit/ndk';
	import ndk from "$lib/stores/provider";
	import { getModalStore, type ToastSettings } from '@skeletonlabs/skeleton';
    import { ndkUser } from '$lib/stores/user';
    import Login from '../login.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { succesPublishToast, errorPublishToast, kindLinks, succesDeletingToast } from '$lib/utils/constants';
    import { NDKlogin, findListTags, findOtherTags } from '$lib/utils/helpers';

	export let parent: any;
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const eventList = $modalStore[0].meta.noteContent

	export const deleteOldEventToast: ToastSettings = {
		message: 'Perfect! you havi migrated all your events',
		background: 'variant-filled-warning',
		timeout: 5000,
		hoverable: true,
		action: {
			label: 'Delete old ones',
			response: () => deleteOldEvents()
		}
	};
	async function updateEvents(eventList: NDKEvent[]) {
		!$ndk.signer && await NDKlogin();
		for (const event of eventList) {
			modalStore.trigger({ type: 'component', component: 'modalLoading'});
			const ndkEvent = new NDKEvent($ndk);
			ndkEvent.kind = kindLinks;
			let title = event.tagValue("title");
			let summary = event.tagValue("summary");
			ndkEvent.tags = [
			["title", title!],
			summary ? ["summary", summary] : ["summary", ""],
			["d", event.tagValue("d")!],
			];
			let links;
			let labels;
			let hashtags;

			links = findListTags(event.tags).map((tag) => ({
				link: tag.url,
				description: tag.text,
			}));
			for (const linkData of links) {
				const { link, description } = linkData;
				ndkEvent.tags.push(["r", link, description]);
			}
			hashtags = findOtherTags(event.tags, "t").map((tag) => ({ hashtag: tag }));
			for (const hashtagData of hashtags) {
				const { hashtag } = hashtagData;
				ndkEvent.tags.push(["t", hashtag]);
			}
			labels = findOtherTags(event.tags, "l").map((tag) => ({ label: tag }));
			for (const labelData of labels) {
				const { label } = labelData;
				ndkEvent.tags.push(["l", label]);
			}
			
			try {
				await ndkEvent.publish();

				toastStore.trigger(succesPublishToast);
				} catch (e) {
				modalStore.clear();
				toastStore.trigger(errorPublishToast);
				console.log("Error:", e);
			}
		};
		modalStore.clear();
		toastStore.trigger(deleteOldEventToast);
	}
	async function deleteOldEvents(){
		modalStore.trigger({ type: 'component', component: 'modalLoading'});
		for (const event of eventList) {
			try{
				!$ndk.signer && await NDKlogin();
				const ndkEvent = new NDKEvent($ndk);
				ndkEvent.kind = event.kind;
				ndkEvent.kind = event.kind;
				ndkEvent.tags = [["d", event.tagValue("d")!]];
				await ndkEvent.publish()
				await ndkEvent.delete();

				toastStore.trigger(succesDeletingToast);
			} catch (error) {
				modalStore.clear();
				toastStore.trigger(errorPublishToast);
				console.log("Error:", error);
			}
		}
		modalStore.clear();
	}

	
</script>

{#if $modalStore[0]}
	<div class="common-modal-base">
		<header class="common-2xl-header">These lists are in the old format</header>
		<p>Please press the update button to convert them all to the new format.</p>
		<hr/>
		<ol class="list">
			{#each eventList as event, i }
			<li>
				<span>{i+1}.</span>
				<span class="flex-auto">{event.tagValue("title")}</span>
			</li>
			<hr class="!border-surface-700"/>
			{/each}
		</ol>
		<footer class="modal-footer {parent.regionFooter}">
			<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			{#if $ndkUser}
			<button type="button" class="btn {parent.buttonPositive}" on:click={() => updateEvents(eventList)}>Update</button>			{:else}
			<Login doGoto={false}/>
			{/if}
		</footer>

	</div>
{/if}