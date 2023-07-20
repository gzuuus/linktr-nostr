<script lang="ts">
    import Header from "$lib/components/header.svelte"
</script>
<Header/>
<div class="MainAppContainer">
    <slot/>
</div>

<style>
    :root {
        --common-transition:all 0.2s ease-in-out;
        --common-border-style:1px solid var(--accent-color);
        --agnostic-header-background-color: transparent;
        --agnostic-focus-ring-outline-width: 2px;
        --agnostic-btn-primary:white;
        --agnostic-radius: 15px;
        --agnostic-focus-ring-color: var(--hover-b-color);
        --agnostic-btn-primary-color: var(--background-color);
        --agnostic-dark: var(--background-color);        
        --background-color: #10051e;
        --container-b-color: #210b3c;
        --elements-b-color: #2a193e;
        --hover-b-color: #3d2657;
        --translucid-b-color: #000000a3;
        --text-color: #ffffff;
        --hover-color: #ff9900;
        --accent-color: #916dbb;
    }
    :global(body) {
        background: var(--background-color);
        color: var(--text-color);
        display: grid;
        place-content: center;
        min-height: 100vh;
        text-align: center;
    }
    :global(button) {
        margin: 8px 0;
        background-color: white;
        border-radius: var(--agnostic-radius);
        color: var(--background-color);
        border: none;
        padding: 0.5em;
        transition: var(--common-transition) ;
    }
    :global(button:hover) {
        opacity: 0.8;
    }
    :global(a) {
        color: var(--accent-color);
    }

    :global(hr) {
        color: var(--hover-b-color);
    }
    :global(.tag){
        background: var(--background-color) !important;
        color: var(--accent-color) !important;
        border-radius: var(--agnostic-radius);
        border: 1px solid var(--hover-b-color);
        margin-top: 0.3em !important;
        transition: all 0.2s ease-in-out;
    }

    :global(.tag:hover){
        color: var(--text-color) !important;
    }
    :global(.btn-link) {
	border: 1px solid var(--accent-color) !important;
	border-radius: var(--agnostic-radius) !important;
    }

    .MainAppContainer {
        max-width: 400px;
        display: block;
        background: transparent;
        border: 2px solid var(--hover-b-color);
        border-radius: 15px;
        padding: 15px;
    }
</style>
