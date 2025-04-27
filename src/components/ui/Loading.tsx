import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading component to use as Suspense fallback.
 * Centers a spinning loader on the screen.
 */
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full p-4">
      <Loader2 className="animate-spin h-8 w-8" aria-label="Loading" />
      <span className="sr-only">Caricamento in corso...</span>
    </div>
  );
}
