<script lang="ts">
  export let mode: string;
  export let doGoto: boolean = true;
  import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
  import ndk from "$lib/stores/provider";
  import { ndkUser } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  import { Button } from "agnostic-svelte";
  import { page } from "$app/stores";
  import CloseIcon from "$lib/elements/icons/close-icon.svelte";
  let isModalVisible: boolean = false;
  async function login() {
    try {
      const signer = new NDKNip07Signer();
      $ndk.signer = signer;
      ndk.set($ndk);

      const ndkCurrentUser = await signer.user();
      let user = $ndk.getUser({
        npub: ndkCurrentUser.npub,
      });
      ndkUser.set(user);
      if (doGoto) {
        goto(`/${ndkCurrentUser.npub}`);
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error instanceof Error) {
        if (error.message.includes("NIP-07 extension not available")) {
          console.error("NIP-07 extension not available:", error);
          isModalVisible = true;
        } else if (error.message.includes("Prompt was closed")) {
          console.error("Prompt was closed:", error);
        } else {
          console.error("Error on login:", error);
        }
      } else {
        console.error("Error on login:", error);
      }
    }
  }
</script>

{#if mode === "primary"}
  <Button on:click={login} mode="primary" isBlock isRounded>Login</Button>
{:else if mode === "secondary" && $page.url.href !== `${$page.url.origin}/`}
  <Button on:click={login} mode="primary" isRounded>Login</Button>
{/if}
{#if isModalVisible}
  <div class="modal">
    <div class="modal-content">
      <h2>It looks like you don't have a nostr extension installed to log in.</h2>
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
      <div class="closeModal">
        <button on:click={() => (isModalVisible = false)}><CloseIcon size={18} /></button>
      </div>
    </div>
  </div>
{/if}
