import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

type HugoBrandProps = {
  compact?: boolean;
  className?: string;
  variant?: "lockup" | "icon" | "wordmark";
};

const assets = {
  lockup: { src: withBasePath("/brand/hugo-lockup.png"), width: 3248, height: 1060 },
  icon: { src: withBasePath("/brand/hugo-icon.png"), width: 3248, height: 3472 },
  wordmark: { src: withBasePath("/brand/hugo-wordmark.png"), width: 2273, height: 1060 },
};

export function HugoBrand({ compact = false, className, variant = "lockup" }: HugoBrandProps) {
  const asset = assets[variant];
  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt="Hugo"
        priority
        className={cn(
          "w-auto object-contain",
          variant === "lockup" && (compact ? "h-[25px]" : "h-[31px]"),
          variant === "icon" && (compact ? "h-7" : "h-8"),
          variant === "wordmark" && (compact ? "h-[23px]" : "h-7"),
        )}
      />
    </span>
  );
}
