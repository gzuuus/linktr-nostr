<script>
    export let size = 160;
    export let flipHorizontal = false;
    export let flipVertical = false;
</script>
<svg  xmlns="http://www.w3.org/2000/svg" width={size}px height={size}px viewBox="0 0 24 24">
    <g transform={`${flipHorizontal ? "rotate(0 12 12)" : "rotate(180 12 12)"} ${flipVertical ? "rotate(0 12 12)" : "rotate(-180 12 12)"}`}>
        <path fill="currentColor" d="M12 4a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H8a1 1 0 0 1 0-2h3V5a1 1 0 0 1 1-1ZM3 19a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z"/>
    </g>
</svg>
