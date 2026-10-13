import { useState } from 'react';
import { PostMediaItem } from '../../types';
import { Play, Maximize2, X } from 'lucide-react';

interface PostMediaGalleryProps {
  media?: PostMediaItem[];
  imageUrl?: string;
  videoUrl?: string;
}

export function PostMediaGallery({ media, imageUrl, videoUrl }: PostMediaGalleryProps) {
  const [selectedPreview, setSelectedPreview] = useState<PostMediaItem | null>(null);

  // Normalize media items: if media array exists and has elements, use it.
  // Otherwise, construct from legacy imageUrl and videoUrl.
  const items: PostMediaItem[] = 
    media && media.length > 0
      ? media
      : [
          ...(imageUrl ? [{ id: 'legacy-img', type: 'image' as const, url: imageUrl, name: 'Image' }] : []),
          ...(videoUrl ? [{ id: 'legacy-vid', type: 'video' as const, url: videoUrl, name: 'Video' }] : []),
        ];

  if (items.length === 0) return null;

  // Single Item
  if (items.length === 1) {
    const item = items[0];
    return (
      <>
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-[#26282A] max-h-96 w-full bg-[#f8f9fa] dark:bg-[#000000]">
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.name || 'Post attachment'}
              onClick={() => setSelectedPreview(item)}
              className="w-full max-h-96 object-cover object-center hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
            />
          ) : (
            <div className="w-full bg-black max-h-96 flex items-center justify-center">
              <video
                src={item.url}
                controls
                className="w-full max-h-96 object-contain rounded-2xl"
              />
            </div>
          )}
        </div>

        {/* Lightbox Modal for Full View */}
        {selectedPreview && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPreview(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedPreview.url}
                alt={selectedPreview.name || 'Preview'}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // 2 Items
  if (items.length === 2) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#26282A] h-64 bg-[#f8f9fa] dark:bg-[#000000] relative group"
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.name || `Attachment ${idx + 1}`}
                onClick={() => setSelectedPreview(item)}
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300 cursor-pointer"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="w-full h-full object-contain bg-black"
              />
            )}
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] bg-black/70 text-[#D4A373] font-mono-tech pointer-events-none">
              {item.type === 'video' ? 'VIDEO' : 'IMAGE'}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 3 Items
  if (items.length === 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl overflow-hidden">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#26282A] h-52 bg-[#f8f9fa] dark:bg-[#000000] relative group"
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.name || `Attachment ${idx + 1}`}
                onClick={() => setSelectedPreview(item)}
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300 cursor-pointer"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="w-full h-full object-contain bg-black"
              />
            )}
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] bg-black/70 text-[#D4A373] font-mono-tech pointer-events-none">
              {item.type === 'video' ? 'VIDEO' : 'IMAGE'}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 4 or more items
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
      {items.slice(0, 4).map((item, idx) => {
        const isFourth = idx === 3 && items.length > 4;
        return (
          <div
            key={item.id || idx}
            className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-[#26282A] h-48 bg-[#f8f9fa] dark:bg-[#000000] group"
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.name || `Attachment ${idx + 1}`}
                onClick={() => setSelectedPreview(item)}
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-300 cursor-pointer"
              />
            ) : (
              <video
                src={item.url}
                controls={!isFourth}
                className="w-full h-full object-contain bg-black"
              />
            )}
            {isFourth && (
              <div
                onClick={() => setSelectedPreview(item)}
                className="absolute inset-0 bg-black/60 hover:bg-black/70 backdrop-blur-xs flex items-center justify-center text-white font-heading font-bold text-xl cursor-pointer transition-colors"
              >
                +{items.length - 3} more
              </div>
            )}
            {!isFourth && (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] bg-black/70 text-[#D4A373] font-mono-tech pointer-events-none">
                {item.type === 'video' ? 'VIDEO' : 'IMAGE'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
