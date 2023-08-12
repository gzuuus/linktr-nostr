import type { PageServerLoad } from './$types';
import ndkStore from '$lib/stores/provider';
import { isNip05 } from '$lib/utils/helpers';
import { nip05 } from "nostr-tools";
import { get } from 'svelte/store';

export const load: PageServerLoad = async ({ params }) => {
    let user
    const ndk = get(ndkStore);
    if (isNip05(params.userPub)){
        let paramsPromise = await nip05.queryProfile(params.userPub);
        user = ndk.getUser({ hexpubkey: paramsPromise?.pubkey });
    } else{
        user = ndk.getUser({ npub: params.userPub });
    }
    console.log(user);

    return {
        npub: user.npub
    };
};