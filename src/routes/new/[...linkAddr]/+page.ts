import type { PageLoad } from './$types';
import { get as getStore } from 'svelte/store';
import ndkStore from '$lib/stores/provider';
import { isNip05 } from '$lib/utils/helpers';
import { NDKUser} from '@nostr-dev-kit/ndk';

export const load = (async ({ params }) => {
    return {
        listAddr: params.linkAddr
    };
}) satisfies PageLoad;
