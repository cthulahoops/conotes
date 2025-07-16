import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ImageAttachmentProps {
  storageId: Id<"_storage">;
}

export function ImageAttachment({ storageId }: ImageAttachmentProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageUrl = useQuery(api.notes.getImageUrl, { storageId });

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

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
          onClick={openModal}
          style={{ cursor: "pointer" }}
        />
      </div>
      <dialog ref={dialogRef} className="image-modal" onClick={closeModal}>
        <div
          className="image-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={imageUrl} alt="Uploaded image" className="enlarged-image" />
        </div>
      </dialog>
    </>
  );
}
