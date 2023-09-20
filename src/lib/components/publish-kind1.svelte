<script lang="ts">
    export let listTitle:string | undefined = "";
    export let listURL:string | undefined = "";
    export let isPublished:boolean = false
    import { NDKEvent } from "@nostr-dev-kit/ndk";
    import ndk from "$lib/stores/provider";
    import { ndkUser } from "$lib/stores/user";
    import Login from "./login.svelte";

 async function handleSubmit() {
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = 1;
    ndkEvent.content = `I just created a new nostree list called: ${listTitle} \\n URL: ${listURL}`;

    ndkEvent
      .publish()
      .then(() => isPublished = true)
      .catch((error) => {
        console.log("Error:", error);
      });
 }
</script>
{#if $ndkUser}
<h2>Share this list with everyone</h2>
<main>  
    <form on:submit|preventDefault={handleSubmit}>
      <div class="formFieldsContainer">
        <h3><label for="title">Content</label></h3>
        <button type="submit">submit</button>
      </div>
    </form>
  </main>
{:else}
<Login doGoto={false}/>
{/if}