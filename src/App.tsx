import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { StreamFilter } from "./components/StreamFilter";
import { Messages } from "./components/Messages";
import { MessageInput } from "./components/MessageInput";
import { DragContext, type DragContextType } from "./hooks/useDragState";

import { SignIn } from "./SignIn";

export default function App() {
  return (
    <>
      <AuthLoading>Loading</AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Content />
      </Authenticated>
    </>
  );
}

function Content() {
  const [selectedStream, setSelectedStream] = useState<string | undefined>(
    undefined,
  );
  const [hoveredMessages, setHoveredMessages] = useState<Set<string>>(
    new Set(),
  );
  const messages = useQuery(api.notes.getMessages, { stream: selectedStream });
  const allStreams = useQuery(api.notes.getAllStreams);

  const setMessageHovered = useCallback((messageId: string) => {
    setHoveredMessages((prev) => new Set([...prev, messageId]));
  }, []);

  const unsetMessageHovered = useCallback((messageId: string) => {
    setHoveredMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);

  const clearAllHovered = useCallback(() => {
    setHoveredMessages(new Set());
  }, []);

  // Handle hash fragment navigation for hashtags
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#") && hash.length > 1) {
        const streamName = hash.slice(1);
        setSelectedStream(streamName);
      } else if (hash === "") {
        setSelectedStream(undefined);
      }
    };

    // Handle initial hash on page load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Wrapper function to sync stream selection with URL hash
  const handleStreamSelect = useCallback((stream: string | undefined) => {
    setSelectedStream(stream);
    // Update URL hash to match selection
    if (stream) {
      window.location.hash = `#${stream}`;
    } else {
      window.location.hash = "";
    }
  }, []);

  const dragContext: DragContextType = {
    hoveredMessages,
    setMessageHovered,
    unsetMessageHovered,
    clearAllHovered,
  };

  return (
    <DragContext.Provider value={dragContext}>
      <StreamFilter
        selectedStream={selectedStream}
        allStreams={allStreams}
        onStreamSelect={handleStreamSelect}
        onDragEnd={clearAllHovered}
      />
      <Messages messages={messages} currentStreamName={selectedStream} />
      <MessageInput selectedStream={selectedStream} />
    </DragContext.Provider>
  );
}
