import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ImageAttachmentProps {
  storageId: Id<"_storage">;
}

export function ImageAttachment({ storageId }: ImageAttachmentProps) {
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
    <div className="image-attachment">
      <img
        src={imageUrl}
        alt="Uploaded image"
        className="attached-image"
        loading="lazy"
      />
    </div>
  );
}
