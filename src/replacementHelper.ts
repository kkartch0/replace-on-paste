export function applyReplacements(text: string, replacements: { [key: string]: string }): string {
    let result = text;
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(key, "g"), value);
    }
    return result;
}