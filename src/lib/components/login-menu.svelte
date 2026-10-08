<script lang="ts">
  import CheckIcon from "$lib/elements/icons/check-icon.svelte";
  import { autoLoginStore, loginWithExtension, loginWithNostrAddress, activeUser } from "$lib/stores/provider";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { get } from "svelte/store";
  import { localStore } from "$lib/stores/stores";
  import { errorLogin, succesLogin } from "$lib/utils/constants";
  import { fetchWithFallback } from "$lib/utils/helpers";
  import { ProgressRadial, getModalStore, getToastStore } from "$lib/ui";
  import { NIP05_REGEX } from "nostr-tools/nip05";
  let address = "";
  let remember = false;
  let loading = false;
  let isNip46login = false;
  const toastStore = getToastStore();
  const modalStore = getModalStore();
  async function extension() {
    loading = true;
    try {
      const login = await loginWithExtension();
      if (login) {
        const npub = get(activeUser)?.npub;
        if (npub) goto(`${base}/${npub}`);
        toastStore.trigger(succesLogin);
        modalStore.close();
        localStore.update((current) => {
          return {
            ...current,
            loginMethod: "extension",
          };
        });
        console.log($localStore);
      } else {
        toastStore.trigger(errorLogin);
        modalStore.close();
      }
      remember && autoLoginStore.set(true);
      loading = false;
    } catch (e) {
      loading = false;
      toastStore.trigger(errorLogin);
      console.log(e);
    }
  }
  async function login(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    try {
      if (address) {
        const login = await loginWithNostrAddress(address);
        if (login) {
          const npub = get(activeUser)?.npub;
          if (npub) goto(`${base}/${npub}`);
          toastStore.trigger(succesLogin);
          modalStore.close();
          localStore.update((current) => {
            return {
              ...current,
              // never persist secrets (nsec keys); without a loginMethod auto-login simply asks again
              loginMethod: address.trim().startsWith("nsec1") ? undefined : address,
            };
          });
        } else {
          toastStore.trigger(errorLogin);
          modalStore.close();
        }
        remember && autoLoginStore.set(true);
        loading = false;
      }
    } catch (e) {
      loading = false;
      toastStore.trigger(errorLogin);
      console.log(e);
    }
  }
</script>

<div class="flex flex-1 flex-col gap-4">
  {#if loading}
    <ProgressRadial stroke={25} meter="stroke-primary-500" track="stroke-surface-500 opacity-20" value={undefined} />
  {:else}
    <button class="common-btn-filled" on:click={extension}>Login with extension</button>
    {#if !isNip46login}
      <button class="common-btn-filled" on:click={() => (isNip46login = true)}
        >Login with nostr address/conn. string</button
      >
    {:else}
      <form on:submit={login}>
        <label for="address" class="mb-2">Nostr Address / Connection string</label>
        <div class="input-group input-group-divider grid-cols-[1fr_auto]">
          <input type="text" id="address" placeholder="Nostr address/Connection string" bind:value={address} />
          <button type="submit" class="variant-filled-secondary">Login</button>
        </div>
      </form>
      {#if NIP05_REGEX.test(address)}
        {#await fetchWithFallback(address)}
          <ProgressRadial
            width="w-6"
            stroke={25}
            meter="stroke-primary-500"
            track="stroke-surface-500 opacity-20"
            value={undefined}
          />
        {:then value}
          {#if value}
            {#if value?.nip46}
              <section class=" inline-flex justify-between">
                <span class="inline-flex items-center gap-1"><CheckIcon size={16} /> User found!</span>
              </section>
            {:else}
              <section class=" inline-flex justify-between">
                <span class="inline-flex items-center gap-1"><CheckIcon size={16} /> Read-only</span>
              </section>
            {/if}
          {:else if value == undefined}
            <span>User not found!</span>
          {/if}
        {/await}
      {/if}
    {/if}
    <label class="flex space-x-2">
      <input class="checkbox" type="checkbox" bind:checked={remember} />
      <span>Remember me</span>
    </label>
  {/if}
</div>
