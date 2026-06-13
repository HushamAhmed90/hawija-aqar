"use client";
import { useState } from "react";

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div>
      <img src={images[current]} alt={title} className="w-full h-72 md:h-96 object-cover" />
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {images.map((img, i) => (
            <img key={i} src={img} onClick={() => setCurrent(i)}
              className={`h-16 w-20 object-cover rounded cursor-pointer border-2 ${i === current ? "border-[#e8b86d]" : "border-transparent"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
