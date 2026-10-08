interface PopupSettings {
  event: "click" | "hover" | "focus-blur" | "focus-click";
  target: string;
  placement?: "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "right";
  closeQuery?: string;
  middleware?: Record<string, unknown>;
  state?: (e: { state: boolean }) => void;
}

function findPopupTarget(node: HTMLElement, target: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-popup="${target}"]`);
}

function positionPopup(node: HTMLElement, popup: HTMLElement, placement: string = "top") {
  const rect = node.getBoundingClientRect();
  const pop = popup.getBoundingClientRect();
  let top = 0;
  let left = 0;
  switch (placement.split("-")[0]) {
    case "bottom":
      top = rect.bottom + 8;
      left = rect.left + rect.width / 2 - pop.width / 2;
      break;
    case "left":
      top = rect.top + rect.height / 2 - pop.height / 2;
      left = rect.left - pop.width - 8;
      break;
    case "right":
      top = rect.top + rect.height / 2 - pop.height / 2;
      left = rect.right + 8;
      break;
    default:
      top = rect.top - pop.height - 8;
      left = rect.left + rect.width / 2 - pop.width / 2;
  }
  left = Math.max(8, Math.min(left, window.innerWidth - pop.width - 8));
  top = Math.max(8, Math.min(top, window.innerHeight - pop.height - 8));
  popup.style.position = "fixed";
  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
  popup.style.zIndex = "999";
}

export function popup(node: HTMLElement, settings: PopupSettings) {
  let popupEl = findPopupTarget(node, settings.target);
  let visible = false;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  if (popupEl) {
    popupEl.style.position = "fixed";
    popupEl.style.top = "0";
    popupEl.style.left = "0";
    popupEl.style.visibility = "hidden";
    popupEl.style.opacity = "0";
    popupEl.style.transition = "opacity 150ms ease";
    const arrow = popupEl.querySelector<HTMLElement>(".arrow");
    if (arrow) arrow.style.display = "none";
  }

  const closeOn = settings.closeQuery ?? "a[href], button, .list-option";

  function show() {
    if (!popupEl) popupEl = findPopupTarget(node, settings.target);
    if (!popupEl) return;
    clearTimeout(hideTimer);
    popupEl.style.visibility = "visible";
    popupEl.style.opacity = "1";
    positionPopup(node, popupEl, settings.placement);
    visible = true;
    settings.state?.({ state: true });
  }

  function hide() {
    if (!popupEl) return;
    popupEl.style.visibility = "hidden";
    popupEl.style.opacity = "0";
    visible = false;
    settings.state?.({ state: false });
  }

  function scheduleHide() {
    hideTimer = setTimeout(hide, 150);
  }

  function onDocumentClick(e: Event) {
    if (!visible || !popupEl) return;
    const target = e.target as HTMLElement;
    if (popupEl.contains(target)) {
      if (target.closest(closeOn)) hide();
      return;
    }
    if (!node.contains(target)) hide();
  }

  function onWindowReposition() {
    if (visible && popupEl) positionPopup(node, popupEl, settings.placement);
  }

  const listeners: [string, EventListener][] = [];
  function on(el: EventTarget, event: string, handler: EventListener) {
    el.addEventListener(event, handler);
    listeners.push([event, handler as EventListener]);
  }

  switch (settings.event) {
    case "hover":
      on(node, "mouseenter", show);
      on(node, "mouseleave", scheduleHide);
      if (popupEl) {
        on(popupEl, "mouseenter", () => clearTimeout(hideTimer));
        on(popupEl, "mouseleave", hide);
      }
      break;
    case "click":
    case "focus-click":
      on(node, "click", () => (visible ? hide() : show()));
      break;
    case "focus-blur":
      on(node, "focus", show);
      on(node, "blur", scheduleHide);
      break;
  }
  document.addEventListener("click", onDocumentClick, true);
  window.addEventListener("resize", onWindowReposition);
  window.addEventListener("scroll", onWindowReposition, true);

  return {
    update(newSettings: PopupSettings) {
      settings = newSettings;
      popupEl = findPopupTarget(node, settings.target);
    },
    destroy() {
      for (const [event, handler] of listeners) node.removeEventListener(event, handler);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("resize", onWindowReposition);
      window.removeEventListener("scroll", onWindowReposition, true);
      hide();
    },
  };
}

export function clipboard(node: HTMLElement, text: string) {
  function onClick() {
    navigator.clipboard.writeText(text).catch((err) => console.error("Clipboard error", err));
  }
  node.addEventListener("click", onClick);
  return {
    update(newText: string) {
      text = newText;
    },
    destroy() {
      node.removeEventListener("click", onClick);
    },
  };
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function focusTrap(node: HTMLElement, enabled: boolean) {
  function firstFocusable(): HTMLElement | null {
    return node.querySelector<HTMLElement>(FOCUSABLE);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== "Tab" || !enabled) return;
    const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  node.addEventListener("keydown", onKeydown);
  queueMicrotask(() => firstFocusable()?.focus());

  return {
    update(v: boolean) {
      enabled = v;
    },
    destroy() {
      node.removeEventListener("keydown", onKeydown);
    },
  };
}
