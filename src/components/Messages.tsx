import { useCallback, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Message } from "./Message";

interface MessageType {
  _id: Id<"messages">;
  _creationTime: number;
  userId?: Id<"users">;
  body: string;
  streams: string[];
  attachments: Id<"_storage">[];
}

interface MessagesProps {
  messages: MessageType[] | undefined;
  currentStreamName: string | undefined;
}

export function Messages({ messages, currentStreamName }: MessagesProps) {
  const addStreamToMessage = useMutation(api.notes.addStreamToMessage);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [scrollRef]);

  useEffect(() => {
    scrollToBottom();
  }, [currentStreamName, messages, scrollToBottom]);

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    messageId: Id<"messages">,
  ) => {
    e.preventDefault();

    // Only handle stream tag drops, not file drops
    if (e.dataTransfer.files.length > 0) {
      return; // Ignore file drops
    }

    const streamName = e.dataTransfer.getData("text/plain");
    // Validate using the same regex pattern as hashtag extraction
    if (streamName && /^[a-zA-Z0-9_-]+$/.test(streamName)) {
      await addStreamToMessage({
        messageId,
        streamName,
      });
    }
  };

  return (
    <div className="messages-container" ref={scrollRef}>
      {messages?.map((message) => (
        <Message
          key={message._id}
          message={message}
          currentStreamName={currentStreamName}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
