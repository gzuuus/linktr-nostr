<script>
    export let size = 160;
    export let flipHorizontal = false;
</script>
<svg  xmlns="http://www.w3.org/2000/svg" width={size}px height={size}px viewBox="0 0 24 24">
    <g transform={`${flipHorizontal ? "rotate(-90 12 12)" : "rotate(90 12 12)"}`}>
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 15l6-6l6 6"/>
    </g>
</svg>
