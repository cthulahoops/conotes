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
  const generateUploadUrl = useMutation(api.notes.generateUploadUrl);
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<Id<"_storage">[]>([]);
  const [uploading, setUploading] = useState(false);

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();

        const file = item.getAsFile();
        if (!file) continue;

        setUploading(true);

        try {
          const uploadUrl = await generateUploadUrl();

          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!result.ok) {
            throw new Error("Upload failed");
          }

          const { storageId } = await result.json();
          setAttachments([...attachments, storageId]);
        } catch (error) {
          console.error("Upload error:", error);
          alert("Upload failed. Please try again.");
        } finally {
          setUploading(false);
        }

        break;
      }
    }
  };

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
        placeholder="Type a message (Ctrl+Enter to send, paste images directly)"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onPaste={handlePaste}
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
        <button disabled={uploading}>
          {uploading ? "Uploading..." : "Send"}
        </button>
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
