import { useCallback, useEffect, useRef } from "react";
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


  return (
    <div className="messages-container" ref={scrollRef}>
      {messages?.map((message) => (
        <Message
          key={message._id}
          message={message}
          currentStreamName={currentStreamName}
        />
      ))}
    </div>
  );
}
