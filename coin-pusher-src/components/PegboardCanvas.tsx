import React, { useRef, useEffect, useState } from 'react';
import { generateInitialLayout, Shape, isPointInShape, ShapeType, initializeShapeCache } from '../utils/shapeMath';

interface PegboardCanvasProps {
  gridSize?: number;
  holeRadius?: number;
  enabledShapes?: ShapeType[];
}

export const PegboardCanvas: React.FC<PegboardCanvasProps> = ({
  gridSize = 10,
  holeRadius = 1.2,
  enabledShapes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const shapesRef = useRef<Shape[]>([]);
  const isDriftingRef = useRef(false);

  // Initialize shapes & cache
  useEffect(() => {
    initializeShapeCache();
    shapesRef.current = generateInitialLayout(window.innerWidth, window.innerHeight);
    isDriftingRef.current = true;

    // Start drifting immediately
    shapesRef.current.forEach(shape => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.2;
      shape.dx = Math.cos(angle) * speed;
      shape.dy = Math.sin(angle) * speed;
      shape.rotationSpeed = (Math.random() - 0.5) * 0.015;
    });
  }, []);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      setDimensions({ width: newWidth, height: newHeight });

      if (canvasRef.current) {
        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;
      }

      if (!isDriftingRef.current) {
        shapesRef.current = generateInitialLayout(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Update Shapes
      shapesRef.current.forEach(shape => {
        if (shape.dx !== 0 || shape.dy !== 0) {
          shape.x += shape.dx;
          shape.y += shape.dy;
          shape.rotation += shape.rotationSpeed;

          if (shape.x < -shape.size / 2 || shape.x > width + shape.size / 2) shape.dx *= -1;
          if (shape.y < -shape.size / 2 || shape.y > height + shape.size / 2) shape.dy *= -1;

          if (shape.x < -shape.size) shape.x = width + shape.size;
          if (shape.x > width + shape.size) shape.x = -shape.size;
          if (shape.y < -shape.size) shape.y = height + shape.size;
          if (shape.y > height + shape.size) shape.y = -shape.size;
        }
      });

      // Clear Background — deep black
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      const cols = Math.ceil(width / gridSize);
      const rows = Math.ceil(height / gridSize);

      const enabledSet = enabledShapes ? new Set(enabledShapes) : null;

      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const px = ix * gridSize + gridSize / 2;
          const py = iy * gridSize + gridSize / 2;

          let activeShape: Shape | null = null;

          for (const shape of shapesRef.current) {
            if (enabledSet && !enabledSet.has(shape.type)) continue;

            const boundaryRadius = shape.size * 0.75;

            if (
              px < shape.x - boundaryRadius ||
              px > shape.x + boundaryRadius ||
              py < shape.y - boundaryRadius ||
              py > shape.y + boundaryRadius
            ) {
              continue;
            }

            if (isPointInShape(px, py, shape)) {
              activeShape = shape;
              break;
            }
          }

          ctx.beginPath();
          ctx.arc(px, py, holeRadius, 0, Math.PI * 2);

          if (activeShape) {
            ctx.fillStyle = activeShape.color;
            ctx.fill();
          } else {
            ctx.fillStyle = '#111111';
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridSize, holeRadius, enabledShapes]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="block absolute top-0 left-0 w-full h-full"
    />
  );
};