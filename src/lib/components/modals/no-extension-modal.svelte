<script lang="ts">
    import { goto } from "$app/navigation";
    import { getModalStore } from "@skeletonlabs/skeleton";
    export let parent: any;
</script>
<div class="common-modal-base">
    <header class="common-2xl-header">
        It looks like you don't have a nostr extension installed to log in.
    </header>

    <p>But dont worry, please try to install one of the ones listed below and try again.</p>
    <a href="https://getalby.com/" target="_blank" rel="noopener noreferrer">GetAlby</a>
    <a
    href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp"
    target="_blank"
    rel="noopener noreferrer">Nos2x (chrome)</a
    >
    <p>Also consider to read one of this guides to learn more</p>
    <a href="https://habla.news/tony/1681492751274" target="_blank" rel="noopener noreferrer"
    >Welcome to Nostr by Tony</a
    >
    <a href="https://nostr.how/en/what-is-nostr" target="_blank" rel="noopener noreferrer"
    >Nostr.how - What is Nostr?</a
    >
    <button class="w-fit underline" on:click={() => {goto("/explore/nostr"); parent.onClose}}
    >Also you can explore hashtag #nostr
    </button>

    <footer class="{parent.regionFooter}">
        <button class="btn {parent.buttonPositive}" on:click={parent.onClose}>Accept</button>
    </footer>
</div>