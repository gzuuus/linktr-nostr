import { spring } from "svelte/motion";

interface Coords {
  x: number;
}

export function pannable(node: HTMLElement) {
  let x: number;

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      x = event.touches[0].clientX;

      node.dispatchEvent(
        new CustomEvent("panstart", {
          detail: { x },
        })
      );

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      const dx = event.touches[0].clientX - x;
      x = event.touches[0].clientX;

      node.dispatchEvent(
        new CustomEvent("panmove", {
          detail: { dx },
        })
      );
    }
  }

  function handleTouchEnd() {
    x = 0;

    node.dispatchEvent(new CustomEvent("panend"));

    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  }

  node.addEventListener("touchstart", handleTouchStart);

  return {
    destroy() {
      node.removeEventListener("touchstart", handleTouchStart);
    },
  };
}

export const coords = spring<Coords>(
  { x: 0 },
  {
    stiffness: 0.1,
    damping: 0.5,
  }
);

export function handlePanStart() {
  coords.stiffness = coords.damping = 1;
}

export function handlePanMove(event: CustomEvent<{ dx: number }>) {
  coords.update(($coords) => ({
    x: $coords.x + event.detail.dx,
  }));
}

export function initializeCoords() {
  coords.set({ x: 0 });
}
