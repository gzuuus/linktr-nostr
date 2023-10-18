<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { storeTheme } from '$lib/stores/stores';
	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' }
	];

	function setTheme(theme:string) {
        storeTheme.set(theme);
		document.body.setAttribute('data-theme', theme);
	};
</script>
        <div class="space-y-4">
            <section class="flex justify-between items-center">
                <h6 class="h6">Mode</h6>
                <LightSwitch />
            </section>
            <hr />
            <nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
                    <ul>
                        {#each themes as { icon, name, type }}
                            <li>
                                <button
                                    class="option w-full h-full"
                                    type="submit"
                                    name="theme"
                                    on:click={() => setTheme(type)}
                                    value={type}
                                    class:bg-primary-active-token={$storeTheme === type}
                                >
                                    <span>{icon}</span>
                                    <span class="flex-auto text-left">{name}</span>
                                </button>
                            </li>
                        {/each}
                    </ul>
            </nav>
            <!-- <hr />
             <div>
                <a class="btn variant-filled w-full" href="/docs/generator">
                    <i class="fa-solid fa-palette" />
                    <span>Create a Theme</span>
                </a>
            </div> -->
        </div>
