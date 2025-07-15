export function extractStreams(messageBody: string): string[] {
  const lines = messageBody.split("\n");
  const streams = new Set<string>();

  for (const line of lines) {
    const hashtags = line.match(/#([a-zA-Z0-9_-]+)/g);
    if (hashtags) {
      for (const hashtag of hashtags) {
        const streamName = hashtag.replace("#", "").toLowerCase();
        streams.add(streamName);
      }
    }
  }

  return Array.from(streams);
}