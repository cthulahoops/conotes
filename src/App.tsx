import { useState } from "react";
import "./App.css";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const sendMessage = useMutation(api.notes.sendMessage);
  const messages = useQuery(api.notes.getMessages);
  const [messageText, setMessageText] = useState("");

  return (
    <>
      <div>
        {messages?.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> {message.body}
          </div>
        ))}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({
            body: messageText,
          });
          setMessageText("");
        }}
      >
        <textarea 
          placeholder="Type a message (Ctrl+Enter to send)" 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
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
