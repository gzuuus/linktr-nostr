<script>
  import LinktOut from "$lib/elements/icons/linkt-out.svelte";
  import OpenDrawerIcon from "$lib/elements/icons/open-drawer-icon.svelte";
  import ShareIcon from "$lib/elements/icons/share-icon.svelte";
</script>

<div class="DocsContentContainer">
  <h2>Share Naddr</h2>
  <h3>The Naddr address is a specific Nostr URL for your list.</h3>
  <p>It looks something like this:</p>
  <code
    >naddr1qqkxummnw3ex2efdv4jxvdeevycrqtfhxvukytf5xsurzttzxp3nqtfsxs6kgcnpxpjnvwf3xspzqs9eep0ll6hurjkl3sc2fewgses07mjfwxsdcu3at2m8fd0xrdz3qvzqqqr4xyvsnkrg</code
  >
  <p>
    You will find this function on each list card, usually by pressing <OpenDrawerIcon size={18} /> icon to display the drawer.
  </p>
  <hr />
  <p>Unlike slugs, Naddr links are unique for each list.</p>
  <p>Sharing your list through a Naddr link will always point to the same list and display only that list.</p>
  <p>><LinktOut size={18} /> This will open a new tab with the Naddr page.</p>
  <p>
    ><ShareIcon size={18} /> This will open a dialog menu to share the Naddr (only available on mobile).
  </p>
  <p>💡You cannot modify this Naddr address.</p>
</div>
