import { spring } from 'svelte/motion';

interface Coords {
  x: number;
}

export function pannable(node: HTMLElement) {
  let x: number;

  function handleMousedown(event: MouseEvent) {
    x = event.clientX;

    node.dispatchEvent(
      new CustomEvent('panstart', {
        detail: { x },
      })
    );

    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('mouseup', handleMouseup);
  }

  function handleMousemove(event: MouseEvent) {
    const dx = event.clientX - x;
    x = event.clientX;

    node.dispatchEvent(
      new CustomEvent('panmove', {
        detail: { dx },
      })
    );
  }

  function handleMouseup() {
    x = 0;

    node.dispatchEvent(
      new CustomEvent('panend')
    );

    window.removeEventListener('mousemove', handleMousemove);
    window.removeEventListener('mouseup', handleMouseup);
  }

  node.addEventListener('mousedown', handleMousedown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
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