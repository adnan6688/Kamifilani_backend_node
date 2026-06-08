import he from 'he'

export function cleanText(html: string): string {
    if (!html) return "";

    return he
        .decode(html)
        .replace(/<[^>]*>/g, "")
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
