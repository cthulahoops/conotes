interface StreamFilterProps {
  selectedStream: string | undefined;
  allStreams: string[] | undefined;
  onStreamSelect: (stream: string | undefined) => void;
}

export function StreamFilter({
  selectedStream,
  allStreams,
  onStreamSelect,
}: StreamFilterProps) {
  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    stream: string,
  ) => {
    e.dataTransfer.setData("text/plain", stream);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="stream-filter">
      <button
        className={selectedStream === undefined ? "active" : ""}
        onClick={() => onStreamSelect(undefined)}
      >
        All
      </button>
      {allStreams?.map((stream) => (
        <button
          key={stream}
          className={selectedStream === stream ? "active" : ""}
          onClick={() => onStreamSelect(stream)}
          draggable
          onDragStart={(e) => handleDragStart(e, stream)}
        >
          #{stream}
        </button>
      ))}
    </div>
  );
}
