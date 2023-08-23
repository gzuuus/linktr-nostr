<script lang="ts">
    import Header from "$lib/components/header.svelte"
    import 'agnostic-svelte/css/common.min.css';
    import { onMount } from "svelte";
    import ndk from "$lib/stores/provider";
    import { ogImageUrl } from "$lib/utils/constants";
    
    onMount(async () => {
        try {
            $ndk.connect().then(() => console.log('ndk connected successfully'));
        } catch (error) {
            console.error(`Error`, error);
        }
    });
    
</script>
<svelte:head>
  <title>Nostree</title>
  <meta name="description" content='A Nostr-based application to create, manage and discover link lists, show notes and other stuff.' />

  <meta property="og:title" content='Nostree' />
  <meta property="og:description" content='A Nostr-based application to create, manage and discover link lists, show notes and other stuff.' />
  <meta property="og:image" content={ogImageUrl} />
</svelte:head>
<Header/>

<div class="MainAppContainer">
    <slot/>
</div>

<style>
    @font-face {
        font-family: 'Fredoka';
        src: url('/fredoka-variable.woff') format('woff'),
    }
    :global(:root) {
        --common-transition:all 0.2s ease-in-out;
        --common-border-style:1px solid var(--accent-color);
        --common-border-style-hover:1px solid var(--hover-color);
        --agnostic-header-background-color: transparent;
        --agnostic-focus-ring-outline-width: 2px;
        --agnostic-btn-primary:white;
        --agnostic-radius:30px;
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
    :global(.no-line-height){
        line-height: 0;
    }
    :global(body) {
        background: var(--background-color);
        color: var(--text-color);
        display: grid;
        place-content: center;
        min-height: 100vh;
        text-align: center;
        margin: 0;
        font-family: 'Fredoka', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        min-height: 100vh;
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
    :global(.text-color){
        color: var(--text-color);
    }

    :global(hr) {
        color: var(--hover-b-color);
        margin: 0.3em;
    }
    :global(.tag){
        background: var(--background-color) !important;
        color: var(--accent-color) !important;
        border-radius: var(--agnostic-radius);
        border: 1px solid var(--hover-b-color);
        margin-top: 0.3em !important;
        transition: all 0.2s ease-in-out;
        align-items: center;
	    gap: 0.3em;
    }

    :global(.tag:hover){
        color: var(--hover-color) !important;
    }
    :global(.btn-link) {
        border: 1px solid var(--accent-color) !important;
        border-radius: var(--agnostic-radius) !important;
    }
    :global(img, video){
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
        width: 25rem;
        display: block;
    }
    :global(.commonContainerStyle){
        border: 2px solid var(--hover-b-color);
        border-radius: var(--agnostic-radius);
        padding: 15px;
        margin: 1em;
        background: var(--background-color);
    }
    @media screen and (max-width: 479px) {
        .MainAppContainer {
            width: 95vw;
            max-width: 100vw;
            min-height: auto;
        }
    }

    :global(input::placeholder) {
    color: var(--accent-color);
    }
    :global(.eventContainer) {
        margin: 10px;
        padding: 5px;
        border-radius: calc(var(--agnostic-radius)/2);
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
    :global(.switchButtons){
        padding: 0.1em 0.5em;
        border: var(--common-border-style);
        color: var(--accent-color);
        background-color: var(--background-color);
        display: inline-flex;
    }
    :global(.secondary-button){
        padding: 0.3em 0.5em;
        border: var(--common-border-style);
        color: var(--accent-color);
        background-color: var(--background-color);
    }
    :global(.noBorder){
        border: none;
    }
    :global(.noPadding){
        padding: 0;
    }
    :global(.noMargin){
        margin: 0;
    }
    :global(.commonPadding){
        padding: 0.2em 0.3em !important;
    }
    :global(.secondary-button:hover){
        color: var(--text-color);
    }
    :global(.selected) {
        background-color: var(--accent-color);
        color: var(--background-color);
    }
    :global(.hidden) {
            display: none !important;
            pointer-events: none !important;
    }
    :global(svg:hover) {
        color: var(--hover-color);
    }
    :global(.spinnerContainer){
        background: var(--translucid-b-color);
        width: 100%;
        border-radius: var(--agnostic-radius);
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
    }

    :global(.btn) {
	white-space: inherit !important;
    }
    :global(code){
        color: var(--accent-color);
        font-size: medium;
    }
    :global(.full-width){
        width: 100%;
    }
    :global(.space-between){
        justify-content: space-between;
    }
    :global(.inputWithIcon){
        display: flex;
        align-items: center;
        gap: 0.3em;
    }
    :global(.modal) {
        position: fixed;
        top: 0.2em;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: start;
        justify-content: center;
        z-index: 9999;
        overflow: scroll;
        line-height: 1.3em;
    }
    :global(.modal-content) {
        background-color: var(--background-color);
        color: var(--text-color);
        padding: 1em;
        border-radius: var(--agnostic-radius);
        border: var(--common-border-style);
        overflow: scroll;
        word-break: break-word;
    }
    :global(.DocsContentContainer){
        word-break: break-word;
    }
    :global(ul li){
        font-size: 1rem;
    }
    :global(strong){
        text-decoration: underline;
    }
    :global(.noButton) {
    margin: 0;
    display: inline-flex;
    background: transparent;
    cursor: pointer;
    color: var(--accent-color);
    padding: 0.2em;
  }
    :global(.inline-span) {
	display: inline-flex;
	padding: 0 0.2em;
    }
    /* :global(.closeModal) {
        position: absolute;
        top: 0;
        right: 0.6em;
        display: inline-flex;
    } */
</style>
