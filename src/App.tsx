import { useState, useEffect, useRef } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const sendMessage = useMutation(api.notes.sendMessage);
  const [selectedStream, setSelectedStream] = useState<string | undefined>(undefined);
  const messages = useQuery(api.notes.getMessages, { stream: selectedStream });
  const allStreams = useQuery(api.notes.getAllStreams);
  const [messageText, setMessageText] = useState("");
  const { messagesEndRef } = useScrollToBottom([messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="stream-filter">
        <button 
          className={selectedStream === undefined ? "active" : ""}
          onClick={() => setSelectedStream(undefined)}
        >
          All
        </button>
        {allStreams?.map((stream) => (
          <button
            key={stream}
            className={selectedStream === stream ? "active" : ""}
            onClick={() => setSelectedStream(stream)}
          >
            #{stream}
          </button>
        ))}
      </div>
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
            <div className="message-meta">
              <div className="stream-tags">
                {message.streams?.map((stream) => (
                  <span key={stream} className="stream-tag">
                    #{stream}
                  </span>
                ))}
              </div>
              <div className="timestamp">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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

function useScrollToBottom(deps: unknown[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, deps);

  return { messagesEndRef };
}
