<script>
  export let size = 160;
  export let flip = false;
  export let color = "currentColor";
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="{size}px" height="{size}px" viewBox="0 0 24 24">
  <g transform={flip ? "rotate(90 12 12)" : "rotate(-180 12 12)"}>
    <path fill={color} d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z" />
  </g>
</svg>
