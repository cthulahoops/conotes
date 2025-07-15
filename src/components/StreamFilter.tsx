interface StreamFilterProps {
  selectedStream: string | undefined;
  allStreams: string[] | undefined;
  onStreamSelect: (stream: string | undefined) => void;
}

export function StreamFilter({ selectedStream, allStreams, onStreamSelect }: StreamFilterProps) {
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
        >
          #{stream}
        </button>
      ))}
    </div>
  );
}