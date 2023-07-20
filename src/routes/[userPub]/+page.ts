import type { PageLoad } from './$types';
import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/provider';
import { nip05toPub, isNip05 } from '$lib/utils/helpers';

export const load = (async ({ params }) => {
    const paramsArg = params.userPub;
    const ndk = getStore(ndkStore);
    let npub: any;
  
    if (isNip05(paramsArg)) {
      npub = await nip05toPub(paramsArg);
    } else {
      npub = paramsArg;
    }
    const ndkUser = ndk.getUser({ npub: npub });

    return {
        pubkey: npub
    };
}) satisfies PageLoad;
