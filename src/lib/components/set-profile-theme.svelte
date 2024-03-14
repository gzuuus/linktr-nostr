<script lang="ts">
	export let cssOutput: string | undefined = "";
	export let isNewCustomTheme: boolean = false;
	export let themeName: string | undefined = "";
	export let themeLabel: string | undefined = "";
    import { getToastStore } from '@skeletonlabs/skeleton';
	import { succesPublishToast, errorPublishToast, kindCSSReplaceableAsset, kindCSSAsset } from '$lib/utils/constants';
    import { NDKEvent } from '@nostr-dev-kit/ndk';
	import ndk from "$lib/stores/provider";
	import { getModalStore } from '@skeletonlabs/skeleton';
    import { ndkUser } from '$lib/stores/user';
    import { v4 as uuidv4 } from "uuid";
	import { userCustomTheme } from '$lib/stores/user';
    import { localStore, storeTheme } from '$lib/stores/stores';
    import { NDKlogin, setCustomStyles } from '$lib/utils/helpers';

    const modalStore = getModalStore();
	const toastStore = getToastStore();
	let customStyleSheet: string;
	$:{
		if (typeof document != "undefined") {
			if ($storeTheme == 'customTheme'){
				customStyleSheet = document.querySelector(`style#custom-style`)?.innerHTML!;
			} else {
				customStyleSheet = cssOutput!;
			}	
		}
	}
	$: eventIdentifier = $userCustomTheme.themeIdentifier ? $userCustomTheme.themeIdentifier : `nostree-theme-${uuidv4()}`
    async function EventSubmit(): Promise<void> {
		!$ndk.signer && await NDKlogin();
		modalStore.trigger({ type: 'component', component: 'modalLoading'});
		const ndkEvent = new NDKEvent($ndk);
		ndkEvent.kind = kindCSSReplaceableAsset;
		ndkEvent.content = customStyleSheet;
		ndkEvent.tags=[
        ["d", isNewCustomTheme ? `nostree-theme-${uuidv4()}` : $userCustomTheme.themeIdentifier || `nostree-theme-${uuidv4()}`],
		["title", themeName ? themeName : $storeTheme],
		["L", "nostree-theme"],
        ["l", themeLabel ? themeLabel : $storeTheme],
		]
		try {
			await ndkEvent.publish()
			modalStore.clear()
			toastStore.trigger(succesPublishToast)
			const userTheme = ndkEvent.tagValue('l');
			const themeIdentifier = ndkEvent.tagValue('d');
			const themeCustomCss = ndkEvent.content;
			userCustomTheme.set({
				UserTheme: userTheme || undefined,
				themeIdentifier: themeIdentifier || undefined,
				themeCustomCss: themeCustomCss || undefined,
			});
			localStore.update((currentState) => {
			return {
				lastUserLogged: currentState.lastUserLogged,
				lastUserTheme: userTheme,
				currentUserFollows: currentState.currentUserFollows,
				UserIdentifier: currentState.UserIdentifier,
			}});
			storeTheme.set(userTheme || '');

			if (ndkEvent.content) {
				setCustomStyles(ndkEvent.content);
			}
		} catch (error) { 
			modalStore.clear()
			toastStore.trigger(errorPublishToast)
			console.log("Error:", error);
		}
	}
</script>
{#if $ndkUser}
<button class="btn variant-filled w-full" on:click={EventSubmit}>
    <span>{isNewCustomTheme ? 'Publish theme' : 'Use theme in profile'}</span>
</button>
{/if}