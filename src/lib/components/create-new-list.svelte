<script lang="ts">
    export let isFormSent: boolean = false;
    export let doGoto: boolean = true;
    import { NDKEvent } from '@nostr-dev-kit/ndk';
    import ndk from '$lib/stores/provider';
    import { Button, Spinner, Tag } from 'agnostic-svelte';
    import ResetIcon from '$lib/elements/icons/reset-icon.svelte';
    import LinkIcon from '$lib/elements/icons/link-icon.svelte';
    import TextIcon from '$lib/elements/icons/text-icon.svelte';
    import BinIcon from '$lib/elements/icons/bin-icon.svelte';
    import { buildATags, findListTags, findOtherTags } from '$lib/utils/helpers';
    import { v4 as uuidv4 } from 'uuid';
    import InfoIcon from '$lib/elements/icons/info-icon.svelte';
    import { goto } from '$app/navigation';
    import { ndkUser } from '$lib/stores/user';
    import { kindLinks } from '$lib/utils/constants';
    import { generateNanoId } from '$lib/utils/helpers';
    import InfoDialog from '$lib/components/info-dialog.svelte';
    import SlugIcon from '$lib/elements/icons/slug-icon.svelte';
    import { nip19 } from 'nostr-tools';
    import InsertIcon from '$lib/elements/icons/insert-icon.svelte';
    import ChevronIconVertical from '$lib/elements/icons/chevron-icon-vertical.svelte';
    import { isNip05Valid as isNip05ValidStore } from '$lib/stores/user';

    export let eventToEdit: NDKEvent | null = null;
    let showSpinner = false;
    const newDTag = `nostree-${uuidv4()}`;
    const validPrefixes: string[] = [
        'http://',
        'https://',
        'ftp://',
        'nostr:',
        'mailto:',
        'tel:',
        'file://',
        'data:',
        'ssh://',
        'irc://'
    ];

    let linkValidationStatus: boolean[] = [];
    let linkNameValidationStatus: boolean[] = [];

    let formData = {
        title: '',
        links: [{ link: '', description: '' }],
        labels: [{ label: '' }],
        forkData: { forkPubKey: '', forkEventoPointer: '' },
        hashtags: [{ hashtag: '' }]
    };

    if (eventToEdit) {
        let title = eventToEdit.tagValue('title');
        const rTags = findListTags(eventToEdit.tags);
        const links = rTags.map((tag) => ({ link: tag.url, description: tag.text }));
        const labels = findOtherTags(eventToEdit.tags, 'l').map((tag) => ({ label: tag }));
        const hashtags = findOtherTags(eventToEdit.tags, 't').map((tag) => ({ hashtag: tag }));

        if (hashtags.length === 0) {
            hashtags.push({ hashtag: '' });
        }

        const forkedFrom = eventToEdit.tagValue('p');
        const ForkData = {
            forkedPubkey: forkedFrom,
            forkedEventoPointer: buildATags(
                undefined,
                [],
                eventToEdit.author.hexpubkey(),
                eventToEdit.kind,
                eventToEdit.tagValue('d')
            )![0]
        };

        formData = {
            title: title!,
            links: links,
            labels: labels,
            forkData: {
                forkPubKey: ForkData.forkedPubkey!,
                forkEventoPointer: ForkData.forkedEventoPointer
            },
            hashtags: hashtags
        };

        validateAllURLs();
        validateAllURLNames();
    }

    let isTitleEmpty = true;
    let titleText = 'List Title';

    $: {
        isTitleEmpty = formData.title.trim() === '';
        if (formData.title.trim() === '') {
            titleText = 'List Title';
        } else {
            titleText = formData.title;
        }
    }

    function validateAllURLs() {
        linkValidationStatus = formData.links.map((linkData) => {
            const isValidPrefix = validPrefixes.some((prefix) => linkData.link.startsWith(prefix));
            return isValidPrefix;
        });
    }

    function validateAllURLNames() {
        linkNameValidationStatus = formData.links.map(
            (linkData) => linkData.description.trim() !== ''
        );
    }

    $: areAllLinksValid =
        linkValidationStatus.length > 0 &&
        linkValidationStatus.every((status) => status) &&
        linkNameValidationStatus.length > 0 &&
        linkNameValidationStatus.every((status) => status);

    function handleSubmit() {
        showSpinner = true;
        const ndkEvent = new NDKEvent($ndk);
        ndkEvent.kind = kindLinks;
        if (eventToEdit) {
            ndkEvent.tags = [
                ['title', formData.title],
                ['d', eventToEdit.tagValue('d')!]
            ];
            for (const labelData of formData.labels) {
                const { label } = labelData;
                ndkEvent.tags.push(['l', encodeURIComponent(label.trim())]);
            }

            for (const hashtagData of formData.hashtags) {
                const { hashtag } = hashtagData;
                if (hashtag.trim() != '') {
                    for (const hashtagData of formData.hashtags) {
                        const { hashtag } = hashtagData;
                        for (const hashtagListElement of hashtag.split(',')) {
                            ndkEvent.tags.push([
                                't',
                                encodeURIComponent(hashtagListElement.trim())
                            ]);
                        }
                    }
                }
            }

            if (formData.forkData && eventToEdit.author.npub == $ndkUser?.npub) {
                if (eventToEdit.tagValue('p') != null && eventToEdit.tagValue('a') != null) {
                    ndkEvent.tags.push(['p', eventToEdit.tagValue('p')!]);
                    ndkEvent.tags.push(['a', eventToEdit.tagValue('a')!]);
                }
            }
            if (formData.forkData && eventToEdit.author.npub != $ndkUser?.npub) {
                ndkEvent.tags.push(['p', nip19.decode(eventToEdit.author.npub).data.toString()]);
                ndkEvent.tags.push([
                    'a',
                    buildATags(
                        undefined,
                        [],
                        eventToEdit.author.hexpubkey(),
                        eventToEdit.kind,
                        eventToEdit.tagValue('d')
                    )![0]
                ]);
            }
        } else {
            ndkEvent.tags = [
                ['title', formData.title],
                ['d', newDTag],
                ['l', 'nostree'],
                [
                    'l',
                    formData.labels[0].label
                        ? formData.labels[0].label
                        : generateNanoId($ndkUser?.npub)
                ]
            ];
            for (const hashtagData of formData.hashtags) {
                const { hashtag } = hashtagData;
                for (const hashtagListElement of hashtag.split(',')) {
                    ndkEvent.tags.push(['t', encodeURIComponent(hashtagListElement.trim())]);
                }
            }
        }
        for (const linkData of formData.links) {
            const { link, description } = linkData;
            ndkEvent.tags.push(['r', link, description]);
        }
        ndkEvent
            .publish()
            .then(() => {
                showSpinner = false;
                isFormSent = true;
                if (doGoto) {
                    goto(`/${$isNip05ValidStore.UserIdentifier}`);
                }
            })
            .catch((error) => {
                console.log('Error:', error);
                showSpinner = false;
            });
    }

    function addLinkField(insertFirstPosition: boolean = true) {
        if (insertFirstPosition) {
            formData.links = [{ link: '', description: '' }, ...formData.links];
        } else {
            formData.links = [...formData.links, { link: '', description: '' }];
        }

        linkValidationStatus.push(false);
        linkNameValidationStatus.push(false);
        validateAllURLs();
        validateAllURLNames();
    }

    function removeLinkField(index: number) {
        formData.links = formData.links.filter((_, i) => i !== index);
        linkValidationStatus.splice(index, 1);
        linkNameValidationStatus.splice(index, 1);
    }

    function handleReset() {
        formData = {
            title: '',
            links: [{ link: '', description: '' }],
            labels: [{ label: '' }],
            forkData: { forkPubKey: '', forkEventoPointer: '' },
            hashtags: [{ hashtag: '' }]
        };
        linkValidationStatus = [];
        linkNameValidationStatus = [];
        eventToEdit = null;
    }

    function handleRemoveLink(index: number) {
        removeLinkField(index);
    }
    function handleMoveLink(index: number, direction: string) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < formData.links.length) {
            const temp = formData.links[index];
            formData.links[index] = formData.links[newIndex];
            formData.links[newIndex] = temp;
        }
    }

    let focusedIndex = -1;
    function handleFocus(index: number) {
        focusedIndex = index;
    }
    function handleBlur() {
        focusedIndex = -1;
    }
</script>

{#if showSpinner}
    <div class="spinnerContainer">
        <Spinner size="xlarge" />
    </div>
{/if}
<main>
    <h2>{titleText}<span class="inline-span"><InfoDialog whatInfo="new-list" /></span></h2>

    <form on:submit|preventDefault={handleSubmit}>
        <div class="formFieldsContainer">
            <h3><label for="title">Title</label></h3>
            <input type="text" id="title" placeholder="Ex. My links" bind:value={formData.title} />

            {#each formData.links as linkData, index}
                <div class="linkField" class:commonBorderStyle={focusedIndex === index}>
                    <div class="inputWithIcon">
                        <label for={`description-${index}`}><TextIcon size={18} /></label>
                        <input
                            class="inputLinkDescription"
                            type="text"
                            id={`description-${index}`}
                            placeholder="Link name"
                            bind:value={linkData.description}
                            on:input={validateAllURLNames}
                        />
                    </div>

                    <div class="inputWithIcon">
                        <label for={`link-${index}`}><LinkIcon size={18} /></label>
                        <input
                            type="text"
                            id={`link-${index}`}
                            placeholder="URL: https://..."
                            bind:value={linkData.link}
                            on:input={validateAllURLs}
                        />
                    </div>

                    {#if !linkValidationStatus[index] && linkData.link.trim()}
                        <span class:hidden={linkData.link.trim() && linkValidationStatus[index]}
                            ><Tag><InfoIcon size={18} /> Prefix needed</Tag></span
                        >
                    {/if}

                    {#if formData.links.length > 1}
                        <div>
                            <button
                                type="button"
                                on:click={() => handleMoveLink(index, 'up')}
                                on:focus={() => handleFocus(index - 1)}
                                on:blur={handleBlur}
                                ><ChevronIconVertical size={18} flipVertical={false} /></button
                            >
                            <button
                                type="button"
                                on:click={() => handleMoveLink(index, 'down')}
                                on:focus={() => handleFocus(index + 1)}
                                on:blur={handleBlur}
                                ><ChevronIconVertical size={18} flipVertical={true} /></button
                            >
                            <button
                                type="button"
                                class="secondary-button"
                                on:click={() => {
                                    handleRemoveLink(index);
                                    validateAllURLs();
                                    validateAllURLNames();
                                }}><BinIcon size={18} /></button
                            >
                        </div>
                    {/if}
                </div>
            {/each}

            {#each formData.labels as linkLabel, index}
                {#if linkLabel.label.trim() != 'nostree'}
                    <div class="linkField">
                        <h3 class="inputWithIcon">Slug <InfoDialog whatInfo="list-slug" /></h3>
                        <div class="inputWithIcon">
                            <label for={`slug`}><SlugIcon size={18} /></label>
                            <input
                                type="text"
                                id={`slug-${index}`}
                                placeholder="short-slug"
                                bind:value={linkLabel.label}
                            />
                        </div>
                    </div>
                {/if}
            {/each}
            <div class="linkField">
                <h3 class="inputWithIcon">Hashtags <InfoDialog whatInfo="list-slug" /></h3>
                <div class="inputWithIcon">
                    <label for="hashtags"><SlugIcon size={18} /></label>
                    <input
                        type="text"
                        id="hashtags"
                        placeholder="hashtags"
                        value={formData.hashtags.map((h) => h.hashtag).join(', ')}
                        on:input={(e) => (formData.hashtags = [{ hashtag: e.target?.value }])}
                    />
                </div>
            </div>

            <div class="formButtons">
                {#if areAllLinksValid && formData.title.trim() != ''}
                    <Button type="button" isRounded on:click={() => addLinkField(true)}
                        ><InsertIcon size={18} /></Button
                    >
                    <Button type="button" isRounded on:click={() => addLinkField(false)}
                        ><div class="FormButtonsAdd">
                            <InsertIcon size={18} flipVertical={true} />
                        </div></Button
                    >
                    <Button isBlock type="submit">Publish</Button>
                {:else}
                    <Button type="button" disabled isRounded on:click={() => addLinkField(true)}
                        ><div class="FormButtonsAdd"><InsertIcon size={18} /></div></Button
                    >
                    <Button type="button" isRounded disabled on:click={() => addLinkField(false)}
                        ><div class="FormButtonsAdd">
                            <InsertIcon size={18} flipVertical={true} />
                        </div></Button
                    >
                    <Button isBlock type="submit" disabled>Publish</Button>
                {/if}
                <Button type="button" isRounded on:click={handleReset}
                    ><ResetIcon size={18} /></Button
                >
            </div>
        </div>
    </form>
</main>

<style>
    .formButtons {
        display: flex;
        gap: 0.3em;
        align-items: center;
        justify-content: center;
    }

    button {
        display: inline-flex;
        line-height: normal;
        padding: 0.3em;
    }

    form {
        padding-top: 0.5em;
    }

    .formFieldsContainer {
        display: flex;
        flex-direction: column;
        gap: 0.3em;
        width: 80%;
        margin: auto;
    }
    @media screen and (max-width: 479px) {
        .formFieldsContainer {
            width: auto;
        }
    }

    .linkField {
        display: flex;
        flex-direction: column;
        gap: 0.3em;
        align-items: center;
        padding-top: 0.2em;
    }

    .inputWithIcon label {
        display: flex;
        align-items: center;
    }

    #title {
        text-align: center;
    }
    .inputLinkDescription:focus {
        background-color: var(--text-color);
        color: var(--background-color);
    }
</style>
