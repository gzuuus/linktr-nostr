<script lang="ts">
    import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from "$lib/stores/provider";
	import { getModalStore } from '@skeletonlabs/skeleton';
    import { ndkUser } from '$lib/stores/user';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
    import Login from './login.svelte';

	export let parent: any;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	const succesToast: ToastSettings = {
	message: 'Published successfully!',
	timeout: 5000,
	hoverable: true,
	background: 'variant-filled-success'
	};
	const errorToast: ToastSettings = {
	message: 'Error on publishing, look at console!',
	timeout: 5000,
	hoverable: true,
	background: 'variant-filled-error'
	};

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
				toastStore.trigger(succesToast)
				modalStore.close()
			}
		)
		.catch((error) => {
			toastStore.trigger(errorToast)
			console.log("Error:", error);
		})
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-6 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Share: {$modalStore[0].title ?? '(title missing)'}</header>

		<form class="modal-form {cForm}">
			<label class="label">
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