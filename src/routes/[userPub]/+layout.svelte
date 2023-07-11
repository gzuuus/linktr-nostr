<script lang="ts">
    import {
		Header,
		HeaderNav,
		HeaderNavItem,
	} from 'agnostic-svelte';
    import LinktrLogo from '$lib/elements/icons/LinktrLogo.svelte';
</script>
<div class="menuContainer">
    <Header>
        
        <div slot="logoleft">
            <div class="headerLogoContainer">
                <a href="/"><LinktrLogo/></a>
            </div>
        </div>
    </Header>
</div>

<slot/>
<style>
    .menuContainer {
        position: fixed;
        width: 100%;
        top: 0;
        right: 0;
    }
</style>

