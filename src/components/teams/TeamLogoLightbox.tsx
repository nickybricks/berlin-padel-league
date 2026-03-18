import { useState } from 'react';
import { Users } from 'lucide-react';

interface TeamLogoLightboxProps {
  logoUrl: string | null;
  teamName: string;
  sizeClass?: string;
  iconSize?: string;
}

export function TeamLogoLightbox({ logoUrl, teamName, sizeClass = 'h-24 w-24', iconSize = 'h-12 w-12' }: TeamLogoLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden ${logoUrl ? 'cursor-pointer' : ''}`}
        onClick={() => logoUrl && setOpen(true)}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${teamName} Logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <Users className={`${iconSize} text-muted-foreground`} />
        )}
      </div>

      {/* Lightbox Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <img
            src={logoUrl!}
            alt={`${teamName} Logo`}
            className="max-h-[80vh] max-w-[90vw] sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl object-contain animate-in zoom-in-90 duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
}
