<script lang="ts">
    import { ndkUser } from "$lib/stores/user";
    import { goto } from "$app/navigation";
    import LogoutIcon from "$lib/elements/icons/logout-icon.svelte";
    import ProfileIcon from "$lib/elements/icons/profile-icon.svelte";
    import { logout } from "$lib/utils/helpers";
    import Login from "./login.svelte";
</script>

<div class="space-y-4">
    <nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
      <ul>
        {#if $ndkUser}
        <li>
          <button
            class="option w-full h-full variant-soft"
            on:click={() => goto(`/${$ndkUser?.npub}`)}
          >
            <span><ProfileIcon size={20} /></span>
            <span class="flex-auto text-left">Go to profile</span>
          </button>
        </li>
        <li>
          <button
            class="option w-full h-full variant-soft"
            on:click={() => goto("/new")}
          >
            <span><ProfileIcon size={20} /></span>
            <span class="flex-auto text-left">Manage Lists</span>
          </button>
        </li>
        <li>
          <button
            class="option w-full h-full variant-soft"
            on:click={logout}
          >
            <span><LogoutIcon size={20} /></span>
            <span class="flex-auto text-left">LogOut</span>
          </button>
        </li>
        {:else}
        <Login mode={"primary"}/>
        {/if}
      </ul>
    </nav>
</div>
