<script>
    import LinktOut from '$lib/elements/icons/linkt-out.svelte';
    import OpenDrawerIcon from '$lib/elements/icons/open-drawer-icon.svelte';
    import ShareIcon from '$lib/elements/icons/share-icon.svelte';
</script>

<div class="DocsContentContainer">
    <h2>Share Slug</h2>
    <h3>Share Slug is a simple way to share your nostree lists under a specific slug.</h3>
    <p>
        You will find this function on each list card, usually by pressing <OpenDrawerIcon
            size={18}
        /> icon to display the drawer.
    </p>
    <hr />
    <p>> <LinktOut size={18} /> This will open a new tab with the slug page.</p>
    <p>
        > <ShareIcon size={18} /> This will open a dialog menu to share the slug (only available on mobile).
    </p>
    <p>💡You can modify this slug at any time on the <a href="/new">Manage page</a>.</p>
    <p>
        💡If you use the same slug for two different lists, both lists will appear on the same page.
    </p>
</div>
