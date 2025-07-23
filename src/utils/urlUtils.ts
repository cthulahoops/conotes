export const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

export function detectUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches || [];
}

export function linkifyText(text: string): string {
  // Don't linkify URLs that are already inside markdown links
  const markdownLinkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;

  // Find all existing markdown links and their positions
  const existingLinks: Array<{ start: number; end: number }> = [];
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    existingLinks.push({
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  // Reset regex
  URL_REGEX.lastIndex = 0;

  return text.replace(URL_REGEX, (url, offset) => {
    // Check if this URL is inside an existing markdown link
    const isInsideLink = existingLinks.some(
      (link) => offset >= link.start && offset < link.end,
    );

    return isInsideLink ? url : `[${url}](${url})`;
  });
}

export function hasUrls(text: string): boolean {
  return URL_REGEX.test(text);
}
