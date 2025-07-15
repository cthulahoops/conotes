import { useState } from "react";
import "./App.css";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { StreamFilter } from "./components/StreamFilter";
import { Messages } from "./components/Messages";

function App() {
  const sendMessage = useMutation(api.notes.sendMessage);
  const [selectedStream, setSelectedStream] = useState<string | undefined>(
    undefined,
  );
  const messages = useQuery(api.notes.getMessages, { stream: selectedStream });
  const allStreams = useQuery(api.notes.getAllStreams);
  const [messageText, setMessageText] = useState("");

  return (
    <>
      <StreamFilter
        selectedStream={selectedStream}
        allStreams={allStreams}
        onStreamSelect={setSelectedStream}
      />
      <Messages messages={messages} />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({
            body: messageText,
            selectedStream: selectedStream,
          });
          setMessageText("");
        }}
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
        <button>Send</button>
      </form>
    </>
  );
}

export default App;

