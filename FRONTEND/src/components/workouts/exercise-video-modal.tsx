import { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, PlayCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export interface ExerciseVideoModalProps {
  open: boolean;
  onClose: () => void;
  exerciseName: string;
  videoUrl?: string;
  description?: string;
}

export function ExerciseVideoModal({
  open,
  onClose,
  exerciseName,
  videoUrl,
  description,
}: ExerciseVideoModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Convert varied YouTube URLs (watch, shorts, youtu.be) to embed URL
  const embedUrl = (() => {
    if (!videoUrl) return null;
    
    // Support standard watch, shorts, and shortened youtu.be links
    const ytMatch = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
    }
    
    return videoUrl; // assume already embeddable or other format
  })();

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={PlayCircleIcon} className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Exercise Demo
              </p>
              <h3 className="text-lg font-black tracking-tight">{exerciseName}</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
          </Button>
        </div>

        {/* Video */}
        <div className="relative aspect-video bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${exerciseName} demonstration`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60">
              <HugeiconsIcon icon={PlayCircleIcon} className="h-16 w-16" />
              <p className="text-sm font-medium">Video demonstration coming soon</p>
            </div>
          )}
        </div>

        {/* Description & Link */}
        {(description || videoUrl) && (
          <div className="p-5 border-t bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
            {videoUrl && (
              <Button asChild variant="outline" size="sm" className="shrink-0 gap-2 rounded-xl">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <HugeiconsIcon icon={PlayCircleIcon} className="h-4 w-4" />
                  Watch on YouTube
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
