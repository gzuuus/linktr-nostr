export function unixTimeNow() {
    return Math.floor(new Date().getTime() / 1000);
}

export function dateTomorrow() {
    return new Date(Date.now() + 3600 * 1000 * 24);
}

export function truncatedBech(bech32: string, length?: number): string {
    return `${bech32.substring(0, length || 9)}...`;
}

export async function copyToClipboard(textToCopy: string) {
    try {
        await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}