import { useEffect, useRef, useState } from "react";
import AppButton from "../../components/AppButton";
import ImagePreview from "./ImagePreview";
import AssetImage from "./AssetImage";
import { apiClient } from "../../../services/api/apiClient";
import { getOwnerType } from "./defaultImages";

const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Image picker + uploader for a single asset image. Three modes:
 *  - Existing item (entityKey + itemId): uploads immediately on selection (PUT).
 *  - Deferred (no itemId): exposes the chosen File via `onFileSelected` so the parent
 *    form can upload after creating the record.
 *
 * Always shows a preview (the new local file or the existing remote image).
 */
function ImageUpload({
  entityKey,
  itemId,
  version,
  onUploaded,
  onFileSelected,
  className = "",
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingPreview, setPendingPreview] = useState(null);

  // Cleanup the local Object URL when the preview changes/unmounts.
  useEffect(() => () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
  }, [pendingPreview]);

  function clearPending() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview(null);
  }

  function validate(file) {
    if (!ALLOWED_MIMES.includes(file.type)) {
      return "Only PNG, JPEG, or WEBP images are allowed.";
    }
    if (file.size > MAX_BYTES) {
      return "Image exceeds the 5 MB limit.";
    }
    return null;
  }

  async function handleFile(file) {
    setError("");
    const message = validate(file);
    if (message) {
      setError(message);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPendingPreview(previewUrl);

    if (itemId) {
      setBusy(true);
      try {
        const ownerType = getOwnerType(entityKey);
        const formData = new FormData();
        formData.append("file", file);
        const metadata = await apiClient.upload(`/images/${ownerType}/${itemId}`, formData);
        onUploaded?.(metadata);
        clearPending();
      } catch (uploadError) {
        setError(uploadError.message || "Could not upload image.");
      } finally {
        setBusy(false);
      }
    } else {
      onFileSelected?.(file);
    }
  }

  function handleRemoveExisting() {
    if (!itemId) {
      clearPending();
      onFileSelected?.(null);
      return;
    }
    setError("");
    setBusy(true);
    apiClient
      .delete(`/images/${getOwnerType(entityKey)}/${itemId}`)
      .then(() => onUploaded?.(null))
      .catch((deleteError) => setError(deleteError.message || "Could not remove image."))
      .finally(() => setBusy(false));
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div
        className="flex items-center gap-4 rounded-2xl border border-dashed border-[var(--color-border-strong)] p-4"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        {pendingPreview ? (
          <ImagePreview src={pendingPreview} alt="New image" onRemove={() => clearPending()} />
        ) : itemId ? (
          <AssetImage entityKey={entityKey} itemId={itemId} version={version} size="lg" />
        ) : (
          <div className="h-28 w-28 rounded-2xl bg-[var(--color-surface-muted)]" aria-hidden="true" />
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_MIMES.join(",")}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
              event.target.value = "";
            }}
          />
          <AppButton type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()} loading={busy}>
            {itemId ? "Replace image" : "Choose image"}
          </AppButton>
          {itemId ? (
            <AppButton type="button" variant="ghost" size="sm" onClick={handleRemoveExisting} loading={busy}>
              Remove
            </AppButton>
          ) : null}
          <p className="text-xs text-[var(--color-text-soft)]">PNG, JPEG, or WEBP — up to 5 MB.</p>
        </div>
      </div>
      {error ? <p className="app-field-error">{error}</p> : null}
    </div>
  );
}

export default ImageUpload;
