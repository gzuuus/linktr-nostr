<script lang="ts">
export let eventToPublish: NDKEvent;
import ndk from "$lib/stores/provider";
import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { errorPublishToast, succesDeletingToast } from './constants';

const modalStore = getModalStore();
const toastStore = getToastStore();
async function deleteEventData (eventToPublish: NDKEvent) {
    try{
        if (!$ndk.signer) return
        modalStore.trigger({ type: 'component', component: 'modalLoading'});
        const ndkEvent = new NDKEvent($ndk);
        ndkEvent.kind = eventToPublish.kind;
        ndkEvent.kind = eventToPublish.kind;
        ndkEvent.tags = [["d", eventToPublish.tagValue("d")!]];
        await ndkEvent.publish()
        await ndkEvent.delete();
        modalStore.clear();
        toastStore.trigger(succesDeletingToast);
    } catch (error) {
        modalStore.clear();
        toastStore.trigger(errorPublishToast);
        console.log("Error:", error);
    }
}

</script>
<button
class="common-btn-sm-ghost"
on:click={() => {
  deleteEventData(eventToPublish);
}}
>
Delete
</button>