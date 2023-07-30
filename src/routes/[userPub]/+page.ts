import type { PageLoad } from './$types';
import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/provider';
import { isNip05 } from '$lib/utils/helpers';
import { NDKUser} from '@nostr-dev-kit/ndk';

export const load = (async ({ params }) => {
    const paramsArg = params.userPub;
    const ndk = getStore(ndkStore);
    let npub: any;
  
    if (isNip05(paramsArg)) {
      let npubPromise = await NDKUser.fromNip05(paramsArg);
      npub = npubPromise?.npub;
    } else {
      npub = paramsArg;
    }
    const ndkUser = ndk.getUser({ npub: npub });

    return {
        pubkey: npub
    };
}) satisfies PageLoad;
