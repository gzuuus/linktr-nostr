<script lang="ts">
    import ndk from "$lib/stores/provider";
    import { NDKUser, NDKNip46Signer } from "@nostr-dev-kit/ndk";

    // TODO: Page to manage and refine contacts, dead contacts, etc.
    async function remoteConnect() {
        let signer: NDKNip46Signer;
        let u = await NDKUser.fromNip05("ghoster@flare.pub");
        console.log(u);
        if (u) {
            console.log(u);
            let remoteUser = u
            signer = new NDKNip46Signer($ndk, remoteUser.pubkey);
            $ndk.signer = signer;
            signer.on("authUrl", (url) => {
                console.log(`Go to ${url} to authorize this request`);
            });
        }
        
    }
</script>
<button on:click={remoteConnect}>Connect</button>