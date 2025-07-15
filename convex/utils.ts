export function extractStreams(messageBody: string): string[] {
  const lines = messageBody.split("\n");
  const streams = new Set<string>();

  for (const line of lines) {
    let processLine = line;

    // Remove leading markdown header markers from the start of the line
    processLine = processLine.replace(/^\s*#+\s*/, "");

    const hashtags = processLine.match(/#([a-zA-Z0-9_-]+)/g);
    if (hashtags) {
      for (const hashtag of hashtags) {
        const streamName = hashtag.replace("#", "").toLowerCase();
        streams.add(streamName);
      }
    }
  }

  return Array.from(streams);
}