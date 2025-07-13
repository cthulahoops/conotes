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
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({
            body: messageText,
          });
          setMessageText("");
        }}
      >
        <input 
          type="text" 
          placeholder="Type a message" 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button>Send</button>
      </form>
      <div>
        {messages?.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> {message.body}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
