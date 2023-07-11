<div class="MainAppContainer">
    <slot/>
</div>

<style>
    :root {
        
        --agnostic-header-background-color: transparent;
        --agnostic-focus-ring-outline-width: 2px;
        --agnostic-btn-primary:#2a193e;
        --agnostic-radius: 15px;
        --agnostic-focus-ring-color: #3d2657;
        --agnostic-link-color:white !important;
        --background-color: #10051e;
        --container-b-color: #210b3c;
        --elements-b-color: #2a193e;
        --hover-b-color: #3d2657;
        --translucid-b-color: #000000a3;
        --text-color: #ffffff;
        --hover-color: #ff9900;
        --accent-color: #916dbb;
    }
    :global(.header) {
        border: 0 !important;
    }
    :global(body) {
        background: var(--background-color);
        color: var(--text-color);
        display: grid;
        place-content: center;
        min-height: 100vh;
        text-align: center;
    }
    :global(button) {
        margin : 8px 0;
    }
    :global(.btn-primary:hover) {
        background: var(--hover-b-color) !important;
    }
    :global(a) {
        --agnostic-link-color: var(--agnostic-link-color);
        color: var(--agnostic-link-color);
        text-decoration: none;
    }
    :global(hr) {
        color: var(--hover-b-color);
    }
    :global(.tag){
        background-color: var(--agnostic-btn-primary) !important;
        color: var(--accent-color) !important;
        margin: 2px 0px;
        opacity: 0.6;
        transition: all 0.15s ease-in-out;

    }
    :global(.tag:hover){
        opacity: 1;
        cursor: pointer;

    }
    :global(.headerLogoContainer svg) {
        transform: scale(0.4);
    }
    .MainAppContainer {
        max-width: 100%;
        max-width: 400px;
        display: block;
        background: transparent;
        border: 2px solid var(--hover-b-color);
        border-radius: 15px;
        padding: 15px;
    }

    :global(.header-content){
	flex-direction: row;
	justify-content: center !important;
    }   


</style>
