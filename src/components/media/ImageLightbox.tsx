"use client";

import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxItem = {
  src: string;
  alt: string;
  caption?: string;
};

export default function ImageLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const open = index !== null && items.length > 0;
  const current = open ? items[index] : null;
  const hasMany = items.length > 1;

  const goPrev = useCallback(() => {
    if (index === null || !hasMany) return;
    onIndexChange((index - 1 + items.length) % items.length);
  }, [hasMany, index, items.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null || !hasMany) return;
    onIndexChange((index + 1) % items.length);
  }, [hasMany, index, items.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      <div
        className="flex max-h-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />
        {(current.caption || hasMany) && (
          <p className="mt-4 max-w-xl text-center text-sm text-white/90">
            {current.caption}
            {hasMany && (
              <span className="ml-2 text-white/50">
                {index! + 1} / {items.length}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
