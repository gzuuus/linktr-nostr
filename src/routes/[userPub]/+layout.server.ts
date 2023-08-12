import { NDKUser } from "@nostr-dev-kit/ndk";

export async function load({ params }) {
    const {userPub} = params;

    if (userPub.startsWith('npub')) {
        return { npub: userPub };
    }
    const user = await NDKUser.fromNip05(userPub);
    console.log(user);
    return {
        npub: user?.npub,
    };
}