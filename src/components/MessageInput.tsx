import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ImageUploader } from "./ImageUploader";

interface MessageInputProps {
  selectedStream: string | undefined;
}

export function MessageInput({ selectedStream }: MessageInputProps) {
  const sendMessage = useMutation(api.notes.sendMessage);
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<Id<"_storage">[]>([]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await sendMessage({
          body: messageText,
          selectedStream: selectedStream,
          attachments: attachments,
        });
        setMessageText("");
        setAttachments([]);
      }}
      className="message-input-form"
    >
      <textarea
        placeholder="Type a message (Ctrl+Enter to send)"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) {
              form.requestSubmit();
            }
          }
        }}
        rows={3}
      />
      <div className="message-input-actions">
        <button>Send</button>
        {attachments.length > 0 && (
          <div className="pending-attachments">
            <span>📎 {attachments.length} image(s) attached</span>
            <button
              type="button"
              onClick={() => setAttachments([])}
              className="clear-attachments"
            >
              Clear
            </button>
          </div>
        )}
        <ImageUploader
          onUpload={(storageId) => {
            setAttachments([...attachments, storageId]);
          }}
        />
      </div>
    </form>
  );
}
