import { NDKUser } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import { isNip05 } from "$lib/utils/helpers";
export async function load({ params }: any) {
    const segments = params.userPub.split('/');
    const userPub: string | undefined = segments.shift();
    if (userPub?.startsWith('npub')) {
        return { npub: userPub, segments};
    } else if (userPub?.startsWith('nprofile')) {
        const decodedData = nip19.decode(userPub).data;
        if (typeof decodedData === 'object' && 'pubkey' in decodedData) {
            return { npub: nip19.npubEncode(decodedData.pubkey), segments };
        }
    } else if (typeof userPub === "string" && !isNip05(userPub)) {
        const addBuild = `${userPub}@nostree.me`;
        const user = await NDKUser.fromNip05(addBuild);
        return {
            npub: user?.npub,
            segments,
        };
    }
    const user = await NDKUser.fromNip05(userPub!);
    
    return {
        npub: user?.npub,
        segments,
    };
}
