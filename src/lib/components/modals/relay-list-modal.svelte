<script lang="ts">
	import ndk from "$lib/stores/provider";
	import { getModalStore } from '@skeletonlabs/skeleton';
	// import { RelayList } from "@nostr-dev-kit/ndk-svelte-components";
	export let parent: any;
	const modalStore = getModalStore();

</script>

{#if $modalStore[0] || parent==undefined}
	<div class="common-modal-base">
		<!-- <RelayList ndk={$ndk} /> -->
	</div>
{/if}