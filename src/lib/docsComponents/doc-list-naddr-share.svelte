<script lang="ts">
  import { page } from "$app/stores";
  import LinkOut from "$lib/elements/icons/link-out.svelte";
  import OpenDrawerIcon from "$lib/elements/icons/open-drawer-icon.svelte";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
</script>

<div class="space-y-8">
  <div class="space-y-4">
    <div>
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">Share with Naddr</h2>
      <p class="text-lg">Naddr is Nostr's native addressing system for sharing content.<br>
        It provides a unique, decentralized way to share your lists across the Nostr network.</p>
    </div>
    
    <div class="pl-4 space-y-6">
      <div>
        <h4 class="font-semibold mb-2">What is Naddr?</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Nostr Address</span> - A unique identifier for your list</li>
          <li><span class="font-medium">Decentralized</span> - Works across all Nostr clients</li>
          <li><span class="font-medium">Permanent</span> - Links remain valid long-term</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-2">Sharing Features</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Copy Link</span> - Share your list's Naddr URL</li>
          <li><span class="font-medium">Cross-Client</span> - Opens in any Nostr client</li>
          <li><span class="font-medium">Verification</span> - Proves list ownership</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold mb-2">Usage Tips</h4>
        <ul class="space-y-2 pl-4">
          <li><span class="font-medium">Direct Share</span> - Copy and share the URL directly</li>
          <li><span class="font-medium">Client Support</span> - Works with Nostr-compatible apps</li>
          <li><span class="font-medium">Backup</span> - Save your Naddr for future reference</li>
        </ul>
      </div>
    </div>
  </div>
</div>
