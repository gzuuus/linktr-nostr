import { NDKUser } from "@nostr-dev-kit/ndk";

export async function load({ params }) {
    const segments = params.userPub.split('/');
    const userPub = segments.shift();
    if (userPub?.startsWith('npub')) {
        return { npub: userPub };
    }
    const user = await NDKUser.fromNip05(userPub!);
    return {
        npub: user?.npub,
    };
}