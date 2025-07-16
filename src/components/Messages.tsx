import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ImageAttachment } from "./ImageAttachment";

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  userId?: Id<"users">;
  body: string;
  streams: string[];
  attachments: Id<"_storage">[];
}

interface MessagesProps {
  messages: Message[] | undefined;
}

export function Messages({ messages }: MessagesProps) {
  const { messagesEndRef } = useScrollToBottom([messages]);
  const [dragOverMessage, setDragOverMessage] = useState<Id<"messages"> | null>(
    null,
  );
  const addStreamToMessage = useMutation(api.notes.addStreamToMessage);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
        <div
          key={message._id}
          className={`message ${dragOverMessage === message._id ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, message._id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, message._id)}
        >
          <strong>User:</strong>
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.body}
            </ReactMarkdown>
          </div>
          {message.attachments.length > 0 && (
            <div className="message-attachments">
              {message.attachments.map((storageId) => (
                <ImageAttachment key={storageId} storageId={storageId} />
              ))}
            </div>
          )}
          <div className="message-meta">
            <div className="stream-tags">
              {message.streams.map((stream) => (
                <span key={stream} className="stream-tag">
                  #{stream}
                </span>
              ))}
            </div>
            <div className="timestamp">
              {formatTimestamp(message._creationTime)}
            </div>
          </div>
        </div>
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
