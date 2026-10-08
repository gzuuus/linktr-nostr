<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let parent: any;
	const modalStore = getModalStore();

</script>

{#if $modalStore[0] || parent==undefined}
	<div class="common-modal-base">
	</div>
{/if}
