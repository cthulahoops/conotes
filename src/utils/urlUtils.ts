export const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

export function detectUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches || [];
}

export function linkifyText(text: string): string {
  return text.replace(URL_REGEX, (url) => `[${url}](${url})`);
}

export function hasUrls(text: string): boolean {
  return URL_REGEX.test(text);
}
