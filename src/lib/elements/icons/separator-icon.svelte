<script>
    export let size = 160;
    export let flip = false;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="{size}px" height="{size}px" viewBox="0 0 24 24">
    <g transform={flip ? 'rotate(-180 12 12)' : 'rotate(90 12 12)'}>
        <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M10 .5a.5.5 0 0 0-.5.5v18a.5.5 0 0 0 1 0V1a.5.5 0 0 0-.5-.5Z"
            clip-rule="evenodd"
        />
    </g>
</svg>
