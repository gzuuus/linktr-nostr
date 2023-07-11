import type { PageLoad } from './$types';
import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/provider';

export const load = (async ({ params }) => {
    const npub = params.userPub;
    const ndk = getStore(ndkStore);
    const ndkUser = ndk.getUser({ npub: npub });

    return {
        pubkey: npub
    };
}) satisfies PageLoad;
