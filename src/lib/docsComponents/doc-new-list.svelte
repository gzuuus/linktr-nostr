<script>
    import BinIcon from '$lib/elements/icons/bin-icon.svelte';
    import EditIcon from '$lib/elements/icons/edit-icon.svelte';
    import PinIcon from '$lib/elements/icons/pin-icon.svelte';
    import PlusSmall from '$lib/elements/icons/plus-small.svelte';
    import ResetIcon from '$lib/elements/icons/reset-icon.svelte';
</script>

<div class="DocsContentContainer">
    <h2>Create New List</h2>
    <h3>Lists are a way to organize your links</h3>
    <p>You can create, edit and manage in the <a href="/new">Manage page</a></p>
    <hr />
    <h4>Form</h4>
    <p>Here you can find a basic form that you can fill with as many links as you want.</p>
    <p>In the fields of the form, you can find:</p>
    <ul>
        <li><strong>Title</strong>: to name your list</li>
        <li>
            <strong>Links</strong>: with two fields, one for the URL and one for the description of
            this URL
        </li>
        <li>
            <strong>Slug</strong>: This allows you to have a memorable way to share your list. It's
            not obligatory; if you leave it blank, it will be automatically generated
        </li>
    </ul>
    <hr />
    <h4>Form Buttons</h4>
    <p>
        The buttons are <PlusSmall size={18} /> to add more link fields, 'Publish' to publish your list,
        and <ResetIcon size={18} />, to reset the list form
    </p>
    <hr />
    <h4>Manage Your Lists</h4>
    <p>
        If you have already created more lists, they will appear under a dropdown called 'All Lists'
    </p>
    <p>There you will find your other lists and three buttons to manage them:</p>
    <ul>
        <li><EditIcon size={18} /> To edit the list</li>
        <li><PinIcon size={18} /> To feature the list and move it to the first position</li>
        <li><BinIcon size={18} /> To delete the list</li>
    </ul>
</div>
