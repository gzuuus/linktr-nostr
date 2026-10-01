import { writable, type Writable } from "svelte/store";
import type { Component } from "svelte";

export interface ModalComponent {
  ref: Component<any>;
  props?: Record<string, unknown>;
  slot?: string;
}

export interface ModalSettings {
  type?: "component" | "alert" | "confirm" | "prompt";
  component?: string | ModalComponent;
  title?: string;
  body?: string;
  value?: unknown;
  valueAttr?: Record<string, unknown>;
  response?: (r: unknown) => void;
  meta?: Record<string, any>;
  image?: string;
  buttonTextCancel?: string;
  buttonTextConfirm?: string;
  buttonTextSubmit?: string;
}

export interface ToastSettings {
  message: string;
  autohide?: boolean;
  timeout?: number;
  background?: string;
  classes?: string;
  hoverable?: boolean;
  action?: { label: string; response: () => void };
  callback?: (response: { id: string; status: "queued" | "closed" }) => void;
}

export interface DrawerSettings {
  id?: string;
  position?: "left" | "top" | "bottom" | "right";
  width?: string;
  height?: string;
  padding?: string;
  rounded?: string;
  shadow?: string;
  bgDrawer?: string;
  bgBackdrop?: string;
  meta?: Record<string, unknown>;
}

export interface AutocompleteOption<T = unknown> {
  label: string;
  value: T;
  keywords?: string;
}

function createModalStore(): Writable<ModalSettings[]> & {
  trigger: (settings: ModalSettings) => void;
  close: () => void;
  clear: () => void;
} {
  const store = writable<ModalSettings[]>([]);
  return {
    ...store,
    trigger: (settings) => store.update((queue) => [...queue, settings]),
    close: () => store.update((queue) => queue.slice(1)),
    clear: () => store.set([]),
  };
}

let toastId = 0;
function createToastStore(): Writable<(ToastSettings & { id: number })[]> & {
  trigger: (settings: ToastSettings) => void;
  close: (id?: number) => void;
  clear: () => void;
} {
  const store = writable<(ToastSettings & { id: number })[]>([]);
  return {
    ...store,
    trigger: (settings) => {
      const toast = { ...settings, id: ++toastId };
      store.update((queue) => [...queue, toast]);
      const timeout = settings.timeout ?? 3000;
      if (settings.autohide !== false && timeout > 0) {
        setTimeout(() => {
          store.update((queue) => queue.filter((t) => t.id !== toast.id));
          settings.callback?.({ id: String(toast.id), status: "closed" });
        }, timeout);
      }
    },
    close: (id) => store.update((queue) => (id === undefined ? queue.slice(0, -1) : queue.filter((t) => t.id !== id))),
    clear: () => store.set([]),
  };
}

function createDrawerStore(): Writable<DrawerSettings> & {
  open: (settings?: DrawerSettings) => void;
  close: () => void;
} {
  const store = writable<DrawerSettings>({ open: false } as DrawerSettings);
  return {
    ...store,
    open: (settings = {}) => store.set({ ...settings }),
    close: () => store.set({} as DrawerSettings),
  };
}

export const modalStore = createModalStore();
export const toastStore = createToastStore();
export const drawerStore = createDrawerStore();

export function getModalStore() {
  return modalStore;
}

export function getToastStore() {
  return toastStore;
}

export function getDrawerStore() {
  return drawerStore;
}

export function initializeStores(): void {}

export const storePopup = writable<Record<string, unknown>>({});
