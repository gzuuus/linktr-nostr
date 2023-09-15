<script lang="ts">
    export let userPub: string;
    export let eventKind: number;
    export let listLabel: string = 'nostree';
    export let dValue: string = '';
    export let showSummary: boolean = false;
    export let isEditHappens: boolean = false;
    export let isFork: boolean = false;
    export let linkListLength: number;

    import { nip19 } from 'nostr-tools';
    import ndk from '$lib/stores/provider';
    import {
        unixToDate,
        buildEventPointer,
        findListTags,
        sortEventList,
        findOtherTags,
        sharePage,
        naddrEncodeATags
    } from '$lib/utils/helpers';
    import { Button, Tag } from 'agnostic-svelte';
    import ParsedContent from './parse-content.svelte';
    import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
    import { kindLinks } from '$lib/utils/constants';
    import { page } from '$app/stores';
    import { isNip05Valid as isNip05ValidStore, ndkUser } from '$lib/stores/user';
    import { goto } from '$app/navigation';
    import OstrichIcon from '$lib/elements/icons/ostrich-icon.svelte';
    import ChevronIconHorizontal from '$lib/elements/icons/chevron-icon-horizontal.svelte';
    import LinktOut from '$lib/elements/icons/linkt-out.svelte';
    import CreateNewList from './create-new-list.svelte';
    import EditIcon from '$lib/elements/icons/edit-icon.svelte';
    import CloseIcon from '$lib/elements/icons/close-icon.svelte';
    import ForkIcon from '$lib/elements/icons/fork-icon.svelte';
    import ProfileCardCompact from '$lib/components/profile-card-compact.svelte';
    import ChevronIconVertical from '$lib/elements/icons/chevron-icon-vertical.svelte';
    import IdIcon from '$lib/elements/icons/id-icon.svelte';
    import SeparatorIcon from '$lib/elements/icons/separator-icon.svelte';
    import { NDKSubscriptionCacheUsage } from '@nostr-dev-kit/ndk';
    import Logo from '$lib/elements/icons/logo.svelte';
    import ListItemsIcon from '$lib/elements/icons/list-items-icon.svelte';

    let userPubDecoded: string = nip19.decode(userPub).data.toString();
    let eventList: NDKEvent[] = [];
    let showDialog: boolean = false;
    let showListsIndex: boolean = false;
    let showListsIndexSwitchTabs: boolean = false;
    let showForkInfo: boolean = false;
    let isSharePossible: boolean =
        typeof navigator !== 'undefined' &&
        'share' in navigator &&
        typeof navigator.share === 'function';
    let isEditMode: boolean = false;
    let isFormSent: boolean = false;
    let eventTitles: string[] = [];
    let eventSlugs: string[] = [];
    const ndkFilter: NDKFilter = dValue
        ? { kinds: [eventKind], authors: [userPubDecoded], '#d': [`${dValue}`] }
        : { kinds: [eventKind], authors: [userPubDecoded], '#l': [`${listLabel}`] };
    async function fetchCurrentEvents() {
        if (eventKind == kindLinks) {
            $ndk.fetchEvents(ndkFilter, {
                closeOnEose: false,
                cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST
            }).then((fetchedEvent) => {
                eventList = Array.from(fetchedEvent);
                linkListLength = eventList.length;

                sortEventList(eventList);
                eventList.forEach((event) => {
                    event.tags.forEach((tag) => {
                        if (tag[0] == 'title') eventTitles.push(tag[1]);
                        if (tag[0] == 'l' && tag[1] != 'nostree') eventSlugs.push(tag[1]);
                    });
                });
            });
        } else {
            const ndkFilter: NDKFilter = dValue
                ? { kinds: [eventKind], authors: [userPubDecoded], '#d': [`${dValue}`], limit: 5 }
                : { kinds: [eventKind], authors: [userPubDecoded], limit: 5 };
            $ndk.fetchEvents(ndkFilter, { closeOnEose: true, groupable: true }).then(
                (fetchedEvent) => {
                    eventList = Array.from(fetchedEvent);
                    sortEventList(eventList);
                }
            );
        }
    }

    $: currentIndex = 0;
    function clampIndex(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    $: {
        if (isFormSent) {
            isEditMode = false;
            isEditHappens = !isEditHappens;
        }
    }
</script>

{#await fetchCurrentEvents()}
    <ListItemsIcon size={50} />
    <h3>Loading Lists</h3>
{:then value}
    <div class="sectionContainer">
        {#if eventKind == kindLinks && eventList.length > 0}
            <div class="eventContentContainer">
                <div class="eventContainerButtons">
                    <div
                        class:full-width={eventList.length > 1}
                        class:space-between={eventList.length > 1}
                    >
                        <button
                            class="switchButtons"
                            class:disabled={currentIndex === 0}
                            class:hidden={eventList.length === 1 || isEditMode}
                            on:click={() =>
                                (currentIndex = clampIndex(
                                    currentIndex - 1,
                                    0,
                                    eventList.length - 1
                                ))}
                        >
                            <ChevronIconHorizontal size={20} flipHorizontal={true} />
                            <code
                                class:hidden={currentIndex === 0}
                                class="inline-span"
                                style="padding-right: 0.5em;">{currentIndex + 1}</code
                            >
                        </button>

                        <h3 class:hidden={isEditMode}>
                            {eventList[currentIndex].tagValue('title')}
                        </h3>

                        <button
                            class="switchButtons"
                            class:disabled={currentIndex == eventList.length - 1}
                            class:hidden={eventList.length == 1 || isEditMode}
                            on:click={() =>
                                (currentIndex = clampIndex(
                                    currentIndex + 1,
                                    0,
                                    eventList.length - 1
                                ))}
                        >
                            <code
                                class:hidden={currentIndex == eventList.length - 1}
                                class="inline-span"
                                style="padding-left: 0.5em;"
                                >{eventList.length + 1 - (currentIndex + 1)}</code
                            >
                            <ChevronIconHorizontal size={20} />
                        </button>
                    </div>
                    <div class:hidden={isEditMode} class="indexDotButtonContainer">
                        <button
                            class="switchButtons noBorder"
                            on:click={() => (showListsIndex = !showListsIndex)}
                        >
                            {#if !showListsIndex}
                                <ChevronIconVertical size={22} flipVertical={true} />
                            {:else}
                                <ChevronIconVertical size={22} flipVertical={false} />
                            {/if}
                        </button>
                    </div>

                    {#if showListsIndex && !isEditMode}
                        {#each findOtherTags(eventList[currentIndex].tags, 'l') as label}
                            {#if label !== 'nostree'}
                                <div>
                                    <div
                                        class:hidden={!showListsIndex}
                                        class="no-line-height listLinkOutContainer listLinkOutContainerContent"
                                    >
                                        {#if $ndkUser}
                                            <div class="listLinkOutSection">
                                                {#if eventList[currentIndex].author.npub != $ndkUser?.npub}
                                                    <button
                                                        class="iconButton"
                                                        on:click={() => {
                                                            isEditMode = !isEditMode;
                                                            isFork = true;
                                                        }}><ForkIcon size={16} /></button
                                                    >
                                                {:else}
                                                    <button
                                                        class="iconButton"
                                                        on:click={() => {
                                                            isEditMode = !isEditMode;
                                                            isFork = false;
                                                        }}><EditIcon size={16} /></button
                                                    >
                                                {/if}
                                            </div>
                                        {/if}

                                        <div class="listLinkOutSection">
                                            {#if !isSharePossible}
                                                <a
                                                    href={`${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button class="iconButton"
                                                        ><LinktOut size={16} /></button
                                                    >
                                                </a>
                                            {:else}
                                                <button
                                                    class="iconButton"
                                                    on:click={() =>
                                                        sharePage(
                                                            `${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`
                                                        )}
                                                >
                                                    <LinktOut size={16} />
                                                </button>
                                            {/if}
                                        </div>

                                        <div class="listLinkOutSection">
                                            {#if !isSharePossible}
                                                <a
                                                    href={`${
                                                        $page.url.origin
                                                    }/a/${buildEventPointer(
                                                        undefined,
                                                        [],
                                                        userPubDecoded,
                                                        eventList[currentIndex].kind,
                                                        eventList[currentIndex].tagValue('d')
                                                    )}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button class="iconButton"
                                                        ><IdIcon size={16} /></button
                                                    >
                                                </a>
                                            {:else}
                                                <button
                                                    class="iconButton"
                                                    class:hidden={!isSharePossible}
                                                    on:click={() =>
                                                        sharePage(
                                                            `${
                                                                $page.url.origin
                                                            }/a/${buildEventPointer(
                                                                undefined,
                                                                [],
                                                                userPubDecoded,
                                                                eventList[currentIndex].kind,
                                                                eventList[currentIndex].tagValue(
                                                                    'd'
                                                                )
                                                            )}`
                                                        )}
                                                >
                                                    <IdIcon size={16} />
                                                </button>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                        <SeparatorIcon size={24} />
                        <div>
                            <button
                                class="commonPadding switchButtons"
                                class:selected={!showListsIndexSwitchTabs}
                                on:click={() =>
                                    (showListsIndexSwitchTabs = !showListsIndexSwitchTabs)}
                                >Lists</button
                            >
                            <button
                                class="commonPadding switchButtons"
                                class:selected={showListsIndexSwitchTabs}
                                on:click={() =>
                                    (showListsIndexSwitchTabs = !showListsIndexSwitchTabs)}
                                >Slugs</button
                            >
                        </div>
                        <div class="listsIndexSection">
                            {#each eventTitles as title, index}
                                <button
                                    class="noButton inline-span"
                                    class:hidden={showListsIndexSwitchTabs}
                                    style={currentIndex == index ? 'color: var(--text-color);' : ''}
                                    on:click={() => {
                                        currentIndex = index;
                                        showListsIndex = !showListsIndex;
                                    }}>{index + 1}.{title}</button
                                >
                            {/each}
                            {#each eventSlugs as slug}
                                <button
                                    class="noButton inline-span"
                                    class:hidden={!showListsIndexSwitchTabs}
                                    on:click={() => {
                                        goto(
                                            `${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${slug}`
                                        );
                                    }}>{slug}</button
                                >
                            {/each}
                            <div><Tag>{unixToDate(eventList[currentIndex].created_at)}</Tag></div>
                        </div>
                    {/if}
                </div>
                <div>
                    {#if !isEditMode}
                        {#if eventList.length > 1}
                            <div style="position: relative;">
                                {#each findListTags(eventList[currentIndex].tags) as { url, text }}
                                    {#if url.startsWith('nostr:')}
                                        <a
                                            href={`https://nostr.com/${
                                                url.split(':')[url.split(':').length - 1]
                                            }`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Button isBlock
                                                >{text}
                                                <button class="overlayButton commonPadding"
                                                    ><a href={url} rel="noreferrer"
                                                        ><OstrichIcon size={16} /></a
                                                    ></button
                                                >
                                            </Button>
                                        </a>
                                    {:else}
                                        <a href={url} target="_blank" rel="noreferrer">
                                            <Button isBlock>{text}</Button>
                                        </a>
                                    {/if}
                                {/each}
                            </div>
                        {:else}
                            <div>
                                {#each findListTags(eventList[currentIndex].tags) as { url, text }}
                                    <a href={url} target="_blank" rel="noreferrer">
                                        <Button isBlock>{text}</Button>
                                    </a>
                                {/each}
                            </div>
                        {/if}
                    {:else}
                        <button
                            on:click={() => {
                                isEditMode = false;
                                showDialog = false;
                            }}>{isFork ? 'Forking' : 'Editing'} <CloseIcon size={16} /></button
                        >
                        <CreateNewList
                            bind:isFormSent
                            eventToEdit={eventList[currentIndex]}
                            doGoto={isFork ? true : false}
                        />
                    {/if}
                </div>
                <div class="inline-span">
                    {#each findOtherTags(eventList[currentIndex].tags, 'l') as label}
                        {#if label !== 'nostree' && !label.startsWith(userPub.slice(-3))}
                            <button
                                class="switchButtons commonPadding"
                                on:click={() =>
                                    goto(
                                        `${$page.url.origin}/${$isNip05ValidStore.UserIdentifier}/${label}`
                                    )}><code>{label}</code></button
                            >
                        {/if}
                    {/each}
                    {#each findOtherTags(eventList[currentIndex].tags, 'a') as label}
                        <button
                            class="switchButtons commonPadding"
                            on:click={() => (showForkInfo = !showForkInfo)}
                        >
                            {#if !showForkInfo}
                                <ForkIcon size={20} />
                            {:else}
                                <CloseIcon size={20} />
                            {/if}
                        </button>
                    {/each}
                </div>
                <div class:hidden={!showForkInfo} class="commonPadding">
                    {#each findOtherTags(eventList[currentIndex].tags, 'a') as label}
                        <button
                            class="switchButtons commonPadding inline-span"
                            on:click={() =>
                                goto(`${$page.url.origin}/a/${naddrEncodeATags(label)}`)}
                            ><span>Go to forked list</span> <ForkIcon size={18} /></button
                        >
                        <h3 class="text-align-start">Fork info:</h3>
                        <h4 class="text-align-start">Forked from:</h4>
                        <ProfileCardCompact userPub={nip19.npubEncode(label.split(':')[1])} />
                        <h4 class="text-align-start">Label:</h4>
                        <code class="text-align-start">{label}</code>
                    {/each}
                </div>
            </div>
        {:else}
            {#each eventList as event}
                <div class="eventContainer">
                    <div class="eventContentContainer">
                        {#if event.kind === 30023}
                            <h3>{event.tagValue('title')}</h3>
                            {#if showSummary}
                                <p>{event.tagValue('summary')}</p>
                            {/if}
                        {/if}
                        {#if event.kind != 30023}
                            <ParsedContent content={event.content} />
                        {/if}
                    </div>
                    <div class="infoBox">
                        <Tag>{unixToDate(event.created_at)}</Tag>
                        <a
                            href="https://nostr.com/{buildEventPointer(
                                event.id,
                                [event.relay?.url ?? ''],
                                event.pubkey,
                                event.kind,
                                event.tagValue('d')
                            )}"
                            target="_blank"
                            rel="noreferrer"
                            ><button class="infoButton"
                                ><LinktOut size={20} color="var(--accent-color)" /></button
                            ></a
                        >
                    </div>
                </div>
            {/each}
        {/if}
    </div>
{/await}

<style>
    .listLinkOutSection {
        display: flex;
        flex-direction: column;
        align-items: center;
        /* gap: 0.2em; */
    }
    .overlayButton {
        position: absolute;
        right: 0.3em;
        border: var(--common-border-style);
    }
    button.switchButtons.commonPadding {
        margin-top: 0.3em;
    }
    button.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .infoButton {
        margin: 0;
        display: flex;
        background: transparent;
        border: none;
        transition: all 0.2s ease-in-out;
    }
    .eventContentContainer {
        margin: 0.3em 0;
        word-wrap: break-word;
        overflow: hidden;
    }
    .sectionContainer {
        overflow: auto;
    }
    .indexDotButtonContainer {
        max-width: 100%;
    }
    @media screen and (max-width: 350px) {
        .indexDotButtonContainer {
            overflow: scroll !important;
        }
    }
    .switchButtons {
        padding: 0;
        margin: 0;
        display: inline-flex;
    }
    .eventContainerButtons {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom: 0.3em;
        width: 100%;
        position: relative;
    }
    .listLinkOutContainer {
        gap: 0.5em;
    }
    .listLinkOutContainerContent {
        display: flex;
        gap: 0.5em;
        align-items: baseline;
    }
    .eventContainerButtons > div {
        display: flex;
        gap: 0.5em;
        align-items: center;
    }
    .infoBox {
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid var(--accent-color);
        padding-top: 0.1em;
        gap: 0.5em;
    }
    .listsIndexSection {
        flex-direction: column;
        margin-top: 0.5em;
        gap: 0 !important;
    }
</style>
