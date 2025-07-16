import { useEffect, useRef } from "react";
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
  const { messagesEndRef } = useScrollToBottom([messages]);
  const addStreamToMessage = useMutation(api.notes.addStreamToMessage);

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    messageId: Id<"messages">,
  ) => {
    e.preventDefault();

    const streamName = e.dataTransfer.getData("text/plain");
    if (streamName) {
      await addStreamToMessage({
        messageId,
        streamName,
      });
    }
  };

  return (
    <div className="messages-container">
      {messages?.map((message) => (
        <Message
          key={message._id}
          message={message}
          currentStreamName={currentStreamName}
          onDrop={handleDrop}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

function useScrollToBottom(deps: unknown[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { messagesEndRef };
}
