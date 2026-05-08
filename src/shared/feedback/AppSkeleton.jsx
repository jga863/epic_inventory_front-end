import { cn } from "../utils/cn";

/**
 * Visual placeholder for content that is loading. Variants:
 *  - "text"   thin line for paragraph/copy
 *  - "title"  medium line for headings
 *  - "avatar" round 44px shape
 *  - "card"   block with rounded corners (~104px)
 *
 * Pass `width` / `height` for custom sizing (any CSS length string).
 */
function AppSkeleton({ variant = "text", width, height, className = "", style }) {
  const variantClass =
    variant === "avatar" ? "app-skeleton--avatar" :
    variant === "card" ? "app-skeleton--card" :
    variant === "title" ? "app-skeleton--title" :
    "app-skeleton--text";

  const inlineStyle = { ...style };
  if (width !== undefined) inlineStyle.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) inlineStyle.height = typeof height === "number" ? `${height}px` : height;

  return (
    <span
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn("app-skeleton", variantClass, "block", className)}
      style={inlineStyle}
    />
  );
}

export default AppSkeleton;
