import { Suspense, lazy } from 'react';

// Lazy-load Spline so it doesn't block the initial page render
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#1a7a8c] border-t-transparent animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Loading 3D scene...</span>
      </div>
    </div>
  );
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense fallback={<SplineLoader />}>
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
