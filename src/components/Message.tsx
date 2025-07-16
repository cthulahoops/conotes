import ReactMarkdown from "react-markdown";
import type { Id } from "../../convex/_generated/dataModel";
import { ImageAttachment } from "./ImageAttachment";

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
  isDraggedOver: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, messageId: Id<"messages">) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, messageId: Id<"messages">) => void;
}

export function Message({
  message,
  isDraggedOver,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: MessageProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`message ${isDraggedOver ? "drag-over" : ""}`}
      onDragOver={onDragOver}
      onDragEnter={(e) => onDragEnter(e, message._id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, message._id)}
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
          {message.streams.map((stream) => (
            <span key={stream} className="stream-tag">
              #{stream}
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