import ReactMarkdown from "react-markdown";
import type { Id } from "../../convex/_generated/dataModel";
import { ImageAttachment } from "./ImageAttachment";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useDragState } from "../hooks/useDragState";

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
}

export function Message({ message, currentStreamName }: MessageProps) {
  const removeStreamFromMessage = useMutation(
    api.notes.removeStreamFromMessage,
  );
  const addStreamToMessage = useMutation(api.notes.addStreamToMessage);
  const { hoveredMessages, setMessageHovered, unsetMessageHovered } =
    useDragState();

  const isDraggedOver = hoveredMessages.has(message._id);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isValidStreamDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes("Files")) {
      return false;
    }

    if (e.dataTransfer.types.includes("text/plain")) {
      const text = e.dataTransfer.getData("text/plain");
      return text && /^[a-zA-Z0-9_-]+$/.test(text);
    }

    return false;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Only show visual feedback for valid stream drops
    if (isValidStreamDrop(e)) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (isValidStreamDrop(e)) {
      setMessageHovered(message._id);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      unsetMessageHovered(message._id);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    unsetMessageHovered(message._id);

    if (isValidStreamDrop(e)) {
      const streamName = e.dataTransfer.getData("text/plain");
      await addStreamToMessage({
        messageId: message._id,
        streamName,
      });
    }
  };

  return (
    <div
      className={`message ${isDraggedOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
