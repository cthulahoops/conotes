import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Id } from "../../convex/_generated/dataModel";
import { ImageAttachment } from "./ImageAttachment";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import "./markdown.css";

interface MessageType {
  _id: Id<"messages">;
  _creationTime: number;
  userId?: Id<"users">;
  body: string;
  streams: string[];
  attachments: Id<"_storage">[];
}

interface MessageProps {
  message: MessageType;
  currentStreamName: string | undefined;
  onDrop: (
    e: React.DragEvent<HTMLDivElement>,
    messageId: Id<"messages">,
  ) => void;
}

export function Message({ message, currentStreamName, onDrop }: MessageProps) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const removeStreamFromMessage = useMutation(
    api.notes.removeStreamFromMessage,
  );

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only clear the drag state if we're leaving the message container entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggedOver(false);
    }
  };

  return (
    <div
      className={`message ${isDraggedOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={(e) => {
        setIsDraggedOver(false);
        onDrop(e, message._id);
      }}
    >
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
          {message.streams
            .filter((stream) => stream !== currentStreamName)
            .map((stream) => (
              <span key={stream} className="stream-tag">
                #{stream}
                <button
                  className="stream-tag-remove"
                  onClick={() =>
                    removeStreamFromMessage({
                      messageId: message._id,
                      streamName: stream,
                    })
                  }
                  aria-label={`Remove ${stream} stream`}
                  title={`Remove ${stream} stream`}
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      </div>
      <div className="message-timestamp">
        {formatTimestamp(message._creationTime)}
      </div>
    </div>
  );
}
