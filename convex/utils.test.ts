import { describe, it, expect } from 'vitest';
import { extractStreams } from './utils';

describe('extractStreams', () => {
  it('extracts hashtags from headers with content', () => {
    const message = '# Project Updates #work #urgent';
    const result = extractStreams(message);
    expect(result).toEqual(['work', 'urgent']);
  });

  it('extracts hashtags from multi-level headers', () => {
    const message = '## Meeting Notes #team';
    const result = extractStreams(message);
    expect(result).toEqual(['team']);
  });

  it('extracts hashtags from regular text', () => {
    const message = 'Regular text with #general hashtag';
    const result = extractStreams(message);
    expect(result).toEqual(['general']);
  });

  it('extracts multiple hashtags from multiple lines', () => {
    const message = `# Project Updates #work
Regular message with #general
## Section #team #urgent`;
    const result = extractStreams(message);
    expect(result).toEqual(['work', 'general', 'team', 'urgent']);
  });

  it('ignores markdown headers without hashtags', () => {
    const message = `# Just a Header
## Another Header
Regular text`;
    const result = extractStreams(message);
    expect(result).toEqual([]);
  });

  it('normalizes stream names to lowercase', () => {
    const message = 'Message with #WORK and #Team hashtags';
    const result = extractStreams(message);
    expect(result).toEqual(['work', 'team']);
  });

  it('handles hashtags with numbers, hyphens, and underscores', () => {
    const message = 'Test #stream-1 and #team_alpha and #project2024';
    const result = extractStreams(message);
    expect(result).toEqual(['stream-1', 'team_alpha', 'project2024']);
  });

  it('removes duplicates', () => {
    const message = `Message with #work
Another line with #work again`;
    const result = extractStreams(message);
    expect(result).toEqual(['work']);
  });

  it('handles empty messages', () => {
    const message = '';
    const result = extractStreams(message);
    expect(result).toEqual([]);
  });

  it('handles hashtags with spaces after header markers', () => {
    const message = '#   Spaced Header #work #urgent';
    const result = extractStreams(message);
    expect(result).toEqual(['work', 'urgent']);
  });

  it('extracts hashtags at the start of a line', () => {
    const message = '#conotes\nRegular text with #general';
    const result = extractStreams(message);
    expect(result).toEqual(['conotes', 'general']);
  });
});