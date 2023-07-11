<script lang="ts">
    import type { PageData } from './$types';
    import ProfileCard from '$lib/components/profile-card.svelte';
    import EventCard from '$lib/components/event-card.svelte';
    export let data: PageData;
    $: user = data.pubkey;

</script>

<ProfileCard userPub={user} />
<EventCard userPub={user} />