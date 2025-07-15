import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  user: string;
  body: string;
  timestamp: number;
  streams?: string[];
}

interface MessagesProps {
  messages: Message[] | undefined;
}

export function Messages({ messages }: MessagesProps) {
  const { messagesEndRef } = useScrollToBottom([messages]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="messages-container">
      {messages?.map((message, index) => (
        <div key={index}>
          <strong>{message.user}:</strong>
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
  );
}

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