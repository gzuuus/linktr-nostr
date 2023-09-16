<script>
  import BinIcon from "$lib/elements/icons/bin-icon.svelte";
  import EditIcon from "$lib/elements/icons/edit-icon.svelte";
  import PinIcon from "$lib/elements/icons/pin-icon.svelte";
  import PlusSmall from "$lib/elements/icons/plus-small.svelte";
  import RepublishIcon from "$lib/elements/icons/republish-icon.svelte";
  import ResetIcon from "$lib/elements/icons/reset-icon.svelte";
</script>

<div class="DocsContentContainer">
  <h2>Migrating Old Lists</h2>
  <h3>If you still have old lists that you need to migrate to the new format, don't worry, it's easy.</h3>
  <p>
    Just go to the <a href="/new">Manage page</a> page and if you have lists to migrate, they will automatically appear there
    under the title '🔺 List in old format'.
  </p>
  <hr />
  <p>
    There you will have a couple of buttons, <RepublishIcon size={18} /> to migrate the list to the new format and <BinIcon
      size={18}
    /> if you want to get rid of the list.
  </p>
</div>
