import { useState } from "react";
import "./App.css";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { StreamFilter } from "./components/StreamFilter";
import { Messages } from "./components/Messages";
import { MessageInput } from "./components/MessageInput";

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
  const [selectedStream, setSelectedStream] = useState<string | undefined>(
    undefined,
  );
  const messages = useQuery(api.notes.getMessages, { stream: selectedStream });
  const allStreams = useQuery(api.notes.getAllStreams);

  return (
    <>
      <StreamFilter
        selectedStream={selectedStream}
        allStreams={allStreams}
        onStreamSelect={setSelectedStream}
      />
      <Messages messages={messages} currentStreamName={selectedStream} />
      <MessageInput selectedStream={selectedStream} />
    </>
  );
}
