<script>
    export let size = 160;
    export let flip = false;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="{size}px" height="{size}px" viewBox="0 0 24 24">
    <g
        transform={flip ? 'rotate(-180 12 12)' : 'rotate(0 12 12)'}
        fill="none"
        stroke="currentColor"
        stroke-width="2"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 3v18m0-18l-4 4m4-4l4 4M8 10l-4 4l4 4"
        /><path d="M15 21a7 7 0 0 0-7-7H4" />
    </g>
</svg>
