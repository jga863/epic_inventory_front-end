import { cn } from "../../utils/cn";

/**
 * Pure presentational image preview with optional remove action overlay.
 * Used inside ImageUpload and detail panels.
 */
function ImagePreview({ src, alt, size = "md", onRemove, className = "" }) {
  const sizeClass = size === "lg" ? "h-40 w-40" : size === "sm" ? "h-16 w-16" : "h-28 w-28";

  return (
    <div className={cn("relative inline-block", className)}>
      <img
        src={src}
        alt={alt || "Image preview"}
        className={cn(sizeClass, "rounded-2xl object-cover border border-[var(--color-border)]")}
      />
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-2 -top-2 rounded-full bg-[var(--color-danger)] px-2 py-1 text-xs font-bold text-white shadow-md hover:opacity-90"
          aria-label="Remove image"
        >
          x
        </button>
      ) : null}
    </div>
  );
}

export default ImagePreview;
