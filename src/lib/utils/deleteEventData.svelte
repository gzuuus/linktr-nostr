<script lang="ts">
  export let eventToPublish: NostrEvent;
  import nostrClient from "$lib/stores/provider";
  import { getModalStore, getToastStore } from "$lib/ui";
  import { NostrEvent } from "$lib/nostr/client";
  import { errorPublishToast, succesDeletingToast } from "./constants";

  const modalStore = getModalStore();
  const toastStore = getToastStore();
  async function deleteEventData(eventToPublish: NostrEvent) {
    try {
      if (!$nostrClient.signer) return;
      modalStore.trigger({ type: "component", component: "modalLoading" });
      const nostrEvent = new NostrEvent($nostrClient);
      nostrEvent.kind = eventToPublish.kind;
      nostrEvent.kind = eventToPublish.kind;
      nostrEvent.tags = [["d", eventToPublish.tagValue("d")!]];
      await nostrEvent.publish();
      await nostrEvent.delete();
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
