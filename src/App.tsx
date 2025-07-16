import { useState } from "react";
import "./App.css";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { StreamFilter } from "./components/StreamFilter";
import type { Id } from "../convex/_generated/dataModel";
import { Messages } from "./components/Messages";
import { ImageUploader } from "./components/ImageUploader";

import { SignIn } from "./SignIn";

export default function App() {
  return (
    <>
      <AuthLoading>Loading</AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Content />
      </Authenticated>
    </>
  );
}

function Content() {
  const sendMessage = useMutation(api.notes.sendMessage);
  const [selectedStream, setSelectedStream] = useState<string | undefined>(
    undefined,
  );
  const messages = useQuery(api.notes.getMessages, { stream: selectedStream });
  const allStreams = useQuery(api.notes.getAllStreams);
  const [messageText, setMessageText] = useState("");
  const [attachments, setAttachments] = useState<Id<"_storage">[]>([]);

  return (
    <>
      <StreamFilter
        selectedStream={selectedStream}
        allStreams={allStreams}
        onStreamSelect={setSelectedStream}
      />
      <Messages messages={messages} currentStreamName={selectedStream} />
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
      >
        <div className="message-input-container">
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
          <ImageUploader
            onUpload={(storageId) => {
              setAttachments([...attachments, storageId]);
            }}
          />
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
        </div>
        <button>Send</button>
      </form>
    </>
  );
}
