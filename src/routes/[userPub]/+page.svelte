<script lang="ts">
    import { NDKUser } from '@nostr-dev-kit/ndk';
    import type { PageData } from './$types';
    import ProfileCard from '$lib/components/profile-card.svelte';

    export let data: PageData;
    console.log(data);
    // let user: String;

    $: user = data.pubkey;

</script>

{user}
<ProfileCard userPub={user} />