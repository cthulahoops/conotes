import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const sendMessage = useMutation(api.notes.sendMessage);
  const messages = useQuery(api.notes.getMessages);
  const [messageText, setMessageText] = useState("");

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div>
        {messages?.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> 
            <div className="markdown-content">
              <ReactMarkdown
                components={{
                  a: ({ href, children, ...props }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                      {children}
                    </a>
                  ),
                }}
              >
                {message.body}
              </ReactMarkdown>
            </div>
            <div className="timestamp">
              {formatTimestamp(message.timestamp)}
            </div>
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
