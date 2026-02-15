import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { Overlay } from './components/Overlay';
import { GameState } from './types';
import { WalletProvider } from './context/WalletContext';

const AppContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    balance: 100,
    netProfit: 0,
    fps: 0,
    isPaused: false,
  });

  const handleUpdate = useCallback((partialState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...partialState }));
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Engine
    const engine = new GameEngine({
        debugControls: true, 
        debugFps: true
    });
    
    engine.initialize(canvasRef.current, handleUpdate).then(() => {
        engineRef.current = engine;
    });

    // Resize Observer
    const handleResize = () => {
        if (canvasRef.current && engineRef.current) {
            engineRef.current.resize(window.innerWidth, window.innerHeight);
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        engine.cleanup();
    };
  }, [handleUpdate]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!engineRef.current || gameState.isPaused) return;
    
    // Calculate normalized device coordinates (-1 to +1) for x, y
    // We only care about X for drop position really, but let's pass both to engine raycaster
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    engineRef.current.dropCoinAtRaycast(x, y);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-crosshair"
        onPointerDown={handlePointerDown}
      />
      <Overlay 
        state={gameState} 
        onReset={() => engineRef.current?.reset()} 
        onPauseToggle={() => engineRef.current?.togglePause()}
        onBump={() => engineRef.current?.bump()}
        engineRef={engineRef}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
};

export default App;