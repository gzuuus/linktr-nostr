import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const storeTheme = writable(browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton');
export const storePreview = writable(false);
