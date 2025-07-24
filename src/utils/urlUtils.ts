export const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
export const HASHTAG_REGEX = /#[a-zA-Z0-9_-]+/g;

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

  // First linkify URLs and collect their positions in the result
  const urlPositions: Array<{ start: number; end: number }> = [];
  let result = text.replace(URL_REGEX, (url, offset) => {
    // Check if this URL is inside an existing markdown link
    const isInsideLink = existingLinks.some(
      (link) => offset >= link.start && offset < link.end,
    );

    if (isInsideLink) {
      return url;
    }

    const linkifiedUrl = `[${url}](${url})`;
    // Track where this linkified URL will be in the result
    // Note: This is an approximation since earlier replacements affect positions
    urlPositions.push({
      start: offset,
      end: offset + linkifiedUrl.length,
    });

    return linkifiedUrl;
  });

  // Then linkify hashtags (but not those already in links or URLs)
  HASHTAG_REGEX.lastIndex = 0;
  result = result.replace(HASHTAG_REGEX, (hashtag, offset) => {
    // Check if this hashtag is inside an existing markdown link in the original text
    const isInsideOriginalLink = existingLinks.some(
      (link) => offset >= link.start && offset < link.end,
    );

    if (isInsideOriginalLink) {
      return hashtag;
    }

    // Check if this hashtag appears to be part of a URL fragment
    // Look for URL pattern before this hashtag
    const beforeHashtag = result.substring(0, offset);
    const urlBeforeHashtag = beforeHashtag.match(
      /https?:\/\/[^\s<>"{}|\\^`[\]]*$/,
    );

    if (urlBeforeHashtag) {
      // This hashtag is part of a URL fragment, don't linkify
      return hashtag;
    }

    // Create a clickable hashtag link that searches for the hashtag
    const hashtagWithoutHash = hashtag.slice(1);
    return `[${hashtag}](#${hashtagWithoutHash})`;
  });

  return result;
}

export function hasUrls(text: string): boolean {
  return URL_REGEX.test(text);
}
