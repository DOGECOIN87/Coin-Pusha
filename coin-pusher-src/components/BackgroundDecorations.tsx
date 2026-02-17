import React, { useEffect, useState } from 'react';

/**
 * Background Decorations Component
 * 
 * Displays Gorbagana-themed assets floating in the background
 * Creates a trashy, chaotic aesthetic matching the brand
 */

interface FloatingAsset {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const BackgroundDecorations: React.FC = () => {
  const [assets, setAssets] = useState<FloatingAsset[]>([]);

  useEffect(() => {
    // Define all available background assets
    const assetPaths = [
      '/assets/backgrounds/g-logo.png',
      '/assets/backgrounds/trash-character-1.png',
      '/assets/backgrounds/trash-character-2.png',
      '/assets/backgrounds/trash-character-3.png',
      '/assets/backgrounds/trash-character-4.png',
      '/assets/backgrounds/trash-character-5.png',
      '/assets/backgrounds/trash-character-6.png',
      '/assets/backgrounds/trash-bin.png',
      '/assets/backgrounds/chains.png',
    ];

    // Generate random floating assets
    const generatedAssets: FloatingAsset[] = [];
    const assetCount = 15; // Number of floating assets

    for (let i = 0; i < assetCount; i++) {
      const randomAsset = assetPaths[Math.floor(Math.random() * assetPaths.length)];
      
      generatedAssets.push({
        id: i,
        src: randomAsset,
        x: Math.random() * 100, // Random X position (0-100%)
        y: Math.random() * 100, // Random Y position (0-100%)
        size: 50 + Math.random() * 150, // Random size (50-200px)
        rotation: Math.random() * 360, // Random rotation
        duration: 20 + Math.random() * 30, // Float duration (20-50s)
        delay: Math.random() * 10, // Random delay (0-10s)
        opacity: 0.05 + Math.random() * 0.15, // Low opacity (0.05-0.2)
      });
    }

    setAssets(generatedAssets);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gorbagana Text Logo - Fixed position */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-10">
        <img 
          src="/assets/backgrounds/gorbagana-text.png" 
          alt="Gorbagana"
          className="w-64 sm:w-96 h-auto"
        />
      </div>

      {/* Floating Assets */}
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="absolute animate-float-slow"
          style={{
            left: `${asset.x}%`,
            top: `${asset.y}%`,
            width: `${asset.size}px`,
            height: `${asset.size}px`,
            opacity: asset.opacity,
            transform: `rotate(${asset.rotation}deg)`,
            animationDuration: `${asset.duration}s`,
            animationDelay: `${asset.delay}s`,
          }}
        >
          <img 
            src={asset.src} 
            alt=""
            className="w-full h-full object-contain"
            style={{
              filter: 'blur(1px)',
            }}
          />
        </div>
      ))}

      {/* Chains on sides */}
      <div className="absolute left-4 top-0 bottom-0 flex items-center opacity-10">
        <img 
          src="/assets/backgrounds/chains.png" 
          alt=""
          className="h-full w-auto object-cover"
          style={{ objectFit: 'repeat-y' }}
        />
      </div>
      <div className="absolute right-4 top-0 bottom-0 flex items-center opacity-10">
        <img 
          src="/assets/backgrounds/chains.png" 
          alt=""
          className="h-full w-auto object-cover"
          style={{ objectFit: 'repeat-y' }}
        />
      </div>

      {/* Corner G logos */}
      <div className="absolute top-4 left-4 opacity-5">
        <img 
          src="/assets/backgrounds/g-logo.png" 
          alt=""
          className="w-24 h-24 sm:w-32 sm:h-32"
        />
      </div>
      <div className="absolute bottom-4 right-4 opacity-5 rotate-180">
        <img 
          src="/assets/backgrounds/g-logo.png" 
          alt=""
          className="w-24 h-24 sm:w-32 sm:h-32"
        />
      </div>

      {/* Trash bins in corners */}
      <div className="absolute bottom-4 left-4 opacity-8">
        <img 
          src="/assets/backgrounds/trash-bin.png" 
          alt=""
          className="w-16 h-16 sm:w-20 sm:h-20"
        />
      </div>
      <div className="absolute top-4 right-4 opacity-8">
        <img 
          src="/assets/backgrounds/trash-bin.png" 
          alt=""
          className="w-16 h-16 sm:w-20 sm:h-20"
        />
      </div>
    </div>
  );
};

export default BackgroundDecorations;
