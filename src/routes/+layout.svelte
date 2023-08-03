<script lang="ts">
    import Header from "$lib/components/header.svelte"
    import 'agnostic-svelte/css/common.min.css';
</script>
<Header/>
<div class="MainAppContainer">
    <slot/>
</div>

<style>
    @font-face {
        font-family: 'Fredoka';
        src: url('$lib/static/fredoka-variable.woff') format('woff'),
    }
    :global(:root) {
        --common-transition:all 0.2s ease-in-out;
        --common-border-style:1px solid var(--accent-color);
        --agnostic-header-background-color: transparent;
        --agnostic-focus-ring-outline-width: 2px;
        --agnostic-btn-primary:white;
        --agnostic-radius: 15px;
        --agnostic-focus-ring-color: var(--hover-b-color);
        --agnostic-btn-primary-color: var(--background-color);
        --agnostic-dark: var(--background-color);
        --agnostic-gray-light: white;
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
        margin: 0;
        font-family: 'Fredoka', sans-serif;
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
    :global(p){
        font-size: 18px;
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
    :global(img){
        width: 100%;
        padding: 5px;
    }
    :global(summary){
        list-style: none;
        align-items: center;
    }
    :global(input){
        background-color: var(--background-color);
        border: var(--common-border-style);
        border-radius: var(--agnostic-radius);
        padding: 0.2em;
        padding-left: 0.5em;
    }
    :global(input:focus){
        background-color: var(--elements-b-color);
    }
    .MainAppContainer {
        max-width: 400px;
        display: block;
        background: transparent;
        border: 2px solid var(--hover-b-color);
        border-radius: 15px;
        padding: 15px;
        margin: 1em;
    }
    :global(input::placeholder) {
    color: var(--accent-color);
    }
    :global(.eventContainer) {
        margin: 10px;
        padding: 5px;
        border-radius: 15px;
        word-wrap: anywhere;
        border: 1px solid var(--hover-b-color);
        transition: max-height 0.3s ease-in-out;
        position: relative;
    }
    :global(.disclose-title::after) {
        color: var(--text-color) !important;
    }
    :global(.disclose-bg .disclose-title) {
        background-color: var(--container-b-color) !important;
        border-radius: var(--agnostic-radius) !important;
    }
    :global(.disclose){
	width: 284px;
    }
    :global(.disclose-panel){
        padding: 0 !important;
    }
    :global(.spinner::after){
        border-color: transparent var(--accent-color) transparent transparent !important;
    }
    :global(::-webkit-scrollbar) {
        width: 2px;
        background-color: transparent;
    }
    :global(::-webkit-scrollbar-thumb) {
        width: 8px;
        background-color: var(--accent-color);
    }
    :global(scrollbar) {
        width: 0;
        background-color: transparent;
    }
    :global(scrollbar-thumb) {
        width: 8px;
        background-color: var(--accent-color);
        border-radius: 4px;
    }
    :global(.borderedSection){
        border: var(--common-border-style);
        display: flex;
        padding: 0.5em;
        border-radius: var(--agnostic-radius);
        margin: 0.3em;
        transition: all 0.2s linear;
    }
    :global(.borderedSection:hover){
        color: var(--hover-color);
    }
</style>
