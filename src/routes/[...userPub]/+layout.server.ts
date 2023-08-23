import { NDKUser } from "@nostr-dev-kit/ndk";

export async function load({ params }: any) {
    const segments = params.userPub.split('/');
    const userPub: string | undefined = segments.shift();
    if (userPub?.startsWith('npub')) {
        return { npub: userPub, segments};
    }
    const user = await NDKUser.fromNip05(userPub!);
    
    return {
        npub: user?.npub,
        segments,
    };
}
