import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ImageAttachmentProps {
  storageId: Id<"_storage">;
}

export function ImageAttachment({ storageId }: ImageAttachmentProps) {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const imageUrl = useQuery(api.notes.getImageUrl, { storageId });

  if (!imageUrl) {
    return (
      <div className="image-attachment loading">
        <div className="image-placeholder">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="image-attachment">
        <img
          src={imageUrl}
          alt="Uploaded image"
          className="attached-image"
          loading="lazy"
          onClick={() => setIsEnlarged(true)}
          style={{ cursor: "pointer" }}
        />
      </div>
      {isEnlarged && (
        <div className="image-modal" onClick={() => setIsEnlarged(false)}>
          <div className="image-modal-content">
            <img
              src={imageUrl}
              alt="Uploaded image"
              className="enlarged-image"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="close-modal"
              onClick={() => setIsEnlarged(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
