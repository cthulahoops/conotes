import { useEffect, useRef, useState } from "react";
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
}

export function Messages({ messages }: MessagesProps) {
  const { messagesEndRef } = useScrollToBottom([messages]);
  const [dragOverMessage, setDragOverMessage] = useState<Id<"messages"> | null>(
    null,
  );
  const addStreamToMessage = useMutation(api.notes.addStreamToMessage);


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    messageId: Id<"messages">,
  ) => {
    e.preventDefault();
    setDragOverMessage(messageId);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only clear the drag state if we're leaving the message container entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverMessage(null);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    messageId: Id<"messages">,
  ) => {
    e.preventDefault();
    setDragOverMessage(null);

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
          isDraggedOver={dragOverMessage === message._id}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
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
