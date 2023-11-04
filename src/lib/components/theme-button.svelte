<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { storeTheme } from '$lib/stores/stores';
    import SetProfileTheme from './set-profile-theme.svelte';
    export let widgetLayout: string = 'max-h-64 lg:max-h-[500px]';
	import { defaultThemes } from '$lib/utils/constants';
    import { userCustomTheme } from '$lib/stores/user';
</script>
        <div class="space-y-4">
            <section class="flex justify-between items-center">
                <span>Mode</span>
                <LightSwitch />
            </section>
            <hr />
            <nav class="list-nav p-4 -m-4 {widgetLayout} overflow-y-auto">
                    <ul>
                        {#each defaultThemes as { icon, name, type }}
                            {#if $userCustomTheme || type != 'customTheme'}
                                <li>
                                    <button
                                        class="option w-full h-full"
                                        type="submit"
                                        name="theme"
                                        on:click={() => storeTheme.set(type)}
                                        value={type}
                                        class:bg-primary-active-token={$storeTheme === type}
                                    >
                                        <span>{icon}</span>
                                        <span class="flex-auto text-left">{name}</span>
                                    </button>
                                </li>
                            {/if}
                        {/each}
                    </ul>
            </nav>
            <hr />
             <div>
                <SetProfileTheme/>
            </div>
        </div>
