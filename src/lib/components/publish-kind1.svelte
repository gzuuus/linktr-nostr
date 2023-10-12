<script lang="ts">
    export let listTitle:string | undefined = "";
    export let listURL:string | undefined = "";
    export let isPublished:boolean = false
    import { NDKEvent } from "@nostr-dev-kit/ndk";
    import ndk from "$lib/stores/provider";
    import { ndkUser } from "$lib/stores/user";
    import Login from "./login.svelte";

  const msgBodyTemplate:string = `Look this cool nostree list \n"${listTitle}" \nURL: ${listURL}`
  let msgBody: string = msgBodyTemplate;

 async function handleSubmit() {
    const ndkEvent = new NDKEvent($ndk);
    ndkEvent.kind = 1;
    ndkEvent.content = msgBody;
    ndkEvent.tags=[
      ["t", "nostree"],
    ]
    ndkEvent
      .publish()
      .then(() => 
        isPublished = true
      )
      .catch((error) => {
        console.log("Error:", error);
      });
 }

</script>
{#if $ndkUser}
<div class="commonContainerStyle">
  <h2>Share this list with everyone</h2>
  <div class="">
    <form on:submit|preventDefault={handleSubmit}>
      <div>
        <div>
          <div>
            <textarea
            class="inputLinkDescription noBorder"
            id="msgBody"
            rows="6"
            placeholder={msgBodyTemplate}
            bind:value={msgBody}
            on:keydown={handleSubmit}
          />
          </div>
        </div>
      </div>
      <button type="submit">Publish</button>
    </form>
    </div>
</div>
{:else}
<Login doGoto={false}/>
{/if}

<!-- <style>
  div.commonContainerStyle{
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }
  textarea{
    background-color: var(--container-b-color);
    border-radius: var(--agnostic-radius);
    padding: 1em 0.5em;
    height: fit-content;
    font-weight: bold;
    font-size: large;
    text-align: center;
    width: 100%;
  }
</style> -->