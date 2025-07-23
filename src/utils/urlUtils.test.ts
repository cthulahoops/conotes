import { describe, it, expect } from 'vitest';
import { linkifyText, detectUrls, hasUrls } from './urlUtils';

describe('linkifyText', () => {
  it('converts plain URLs to markdown links', () => {
    const text = 'Check out https://example.com for more info';
    const result = linkifyText(text);
    expect(result).toBe('Check out [https://example.com](https://example.com) for more info');
  });

  it('converts multiple URLs in text', () => {
    const text = 'Visit https://example.com and https://google.com';
    const result = linkifyText(text);
    expect(result).toBe('Visit [https://example.com](https://example.com) and [https://google.com](https://google.com)');
  });

  it('does not modify URLs already in markdown links', () => {
    const text = 'Click [here](https://example.com) to visit the site';
    const result = linkifyText(text);
    expect(result).toBe('Click [here](https://example.com) to visit the site');
  });

  it('handles mix of plain URLs and markdown links', () => {
    const text = 'See [documentation](https://docs.example.com) or visit https://example.com directly';
    const result = linkifyText(text);
    expect(result).toBe('See [documentation](https://docs.example.com) or visit [https://example.com](https://example.com) directly');
  });

  it('handles HTTP and HTTPS URLs', () => {
    const text = 'HTTP: http://example.com HTTPS: https://example.com';
    const result = linkifyText(text);
    expect(result).toBe('HTTP: [http://example.com](http://example.com) HTTPS: [https://example.com](https://example.com)');
  });

  it('handles URLs with paths and query parameters', () => {
    const text = 'API endpoint: https://api.example.com/users?id=123&format=json';
    const result = linkifyText(text);
    expect(result).toBe('API endpoint: [https://api.example.com/users?id=123&format=json](https://api.example.com/users?id=123&format=json)');
  });

  it('handles URLs at the beginning and end of text', () => {
    const text = 'https://start.com middle text https://end.com';
    const result = linkifyText(text);
    expect(result).toBe('[https://start.com](https://start.com) middle text [https://end.com](https://end.com)');
  });

  it('does not modify text without URLs', () => {
    const text = 'This is just plain text with no URLs';
    const result = linkifyText(text);
    expect(result).toBe('This is just plain text with no URLs');
  });

  it('handles markdown links with different text than URL', () => {
    const text = '[Custom Link Text](https://example.com/very/long/path) and plain https://google.com';
    const result = linkifyText(text);
    expect(result).toBe('[Custom Link Text](https://example.com/very/long/path) and plain [https://google.com](https://google.com)');
  });

  it('handles multiple markdown links in same text', () => {
    const text = 'Links: [First](https://first.com) and [Second](https://second.com) plus https://third.com';
    const result = linkifyText(text);
    expect(result).toBe('Links: [First](https://first.com) and [Second](https://second.com) plus [https://third.com](https://third.com)');
  });

  it('handles URLs with fragments', () => {
    const text = 'Anchor link: https://example.com/page#section1';
    const result = linkifyText(text);
    expect(result).toBe('Anchor link: [https://example.com/page#section1](https://example.com/page#section1)');
  });

  it('handles URLs with ports', () => {
    const text = 'Local dev server: http://localhost:3000/app';
    const result = linkifyText(text);
    expect(result).toBe('Local dev server: [http://localhost:3000/app](http://localhost:3000/app)');
  });
});

describe('detectUrls', () => {
  it('detects single URL', () => {
    const text = 'Visit https://example.com';
    const urls = detectUrls(text);
    expect(urls).toEqual(['https://example.com']);
  });

  it('detects multiple URLs', () => {
    const text = 'Visit https://example.com and http://google.com';
    const urls = detectUrls(text);
    expect(urls).toEqual(['https://example.com', 'http://google.com']);
  });

  it('returns empty array for text without URLs', () => {
    const text = 'No URLs here';
    const urls = detectUrls(text);
    expect(urls).toEqual([]);
  });
});

describe('hasUrls', () => {
  it('returns true for text with URLs', () => {
    const text = 'Check https://example.com';
    expect(hasUrls(text)).toBe(true);
  });

  it('returns false for text without URLs', () => {
    const text = 'No URLs here';
    expect(hasUrls(text)).toBe(false);
  });
});