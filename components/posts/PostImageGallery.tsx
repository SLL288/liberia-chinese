"use client";

import { useState } from 'react';

type PostImage = {
  id: string;
  url: string;
};

type PostImageGalleryProps = {
  images: PostImage[];
  title: string;
};

export function PostImageGallery({ images, title }: PostImageGalleryProps) {
  const [active, setActive] = useState<PostImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border">
        No images
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            className="overflow-hidden rounded-2xl border border-border"
            onClick={() => setActive(image)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={title} className="h-64 w-full object-contain" />
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setActive(null)}
        >
          <div className="max-h-full max-w-5xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.url} alt={title} className="max-h-[80vh] w-full object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
