import { useEffect, useState } from "react";
import { buildImageUrl } from "../../../services/api/apiClient";
import { getDefaultImage, getOwnerType } from "./defaultImages";
import { cn } from "../../utils/cn";

const sizeMap = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-36 w-36",
  hero: "h-48 w-48",
};

/**
 * Renders the image stored for an asset, falling back to the per-entity default
 * placeholder when the backend returns 404 (no image uploaded yet).
 *
 * Pass a `version` prop (typically the record's `updatedAt` or image etag) so the
 * browser refetches automatically when the image is replaced.
 */
function AssetImage({
  entityKey,
  itemId,
  alt,
  size = "md",
  rounded = "lg",
  version,
  className = "",
  fallbackSrc,
}) {
  const ownerType = getOwnerType(entityKey);
  const remoteUrl = ownerType && itemId ? buildImageUrl(ownerType, itemId, version) : null;
  const fallback = fallbackSrc || getDefaultImage(entityKey);
  const [src, setSrc] = useState(remoteUrl || fallback);

  useEffect(() => {
    setSrc(remoteUrl || fallback);
  }, [remoteUrl, fallback]);

  const sizeClass = sizeMap[size] || sizeMap.md;
  const radiusClass = rounded === "full" ? "rounded-full" : "rounded-2xl";

  return (
    <img
      src={src}
      alt={alt || "Asset image"}
      className={cn(sizeClass, radiusClass, "object-cover", className)}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
      loading="lazy"
    />
  );
}

export default AssetImage;
