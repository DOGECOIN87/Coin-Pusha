export type ShapeType = string;

export const SHAPE_TYPES: ShapeType[] = ['trash'];

export interface Shape {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

const BITMAP_SIZE = 256; // Higher res for finer detail
const bitmapCache: Record<string, Uint8Array> = {};
let isCacheInitialized = false;

/**
 * Draws a trashcan silhouette onto a canvas context.
 */
function drawTrashcan(ctx: CanvasRenderingContext2D, s: number) {
  const cx = s / 2;

  // Proportions relative to bitmap size
  const bodyTop = s * 0.30;
  const bodyBottom = s * 0.88;
  const bodyWidthTop = s * 0.36;
  const bodyWidthBottom = s * 0.30;
  const lidY = s * 0.22;
  const lidHeight = s * 0.08;
  const lidWidth = s * 0.42;
  const handleWidth = s * 0.12;
  const handleHeight = s * 0.08;
  const handleTop = lidY - handleHeight;

  ctx.fillStyle = '#FFFFFF';

  // Handle (small rectangle on top of lid)
  ctx.fillRect(cx - handleWidth / 2, handleTop, handleWidth, handleHeight);

  // Lid (wider rectangle)
  ctx.fillRect(cx - lidWidth / 2, lidY, lidWidth, lidHeight);

  // Body (trapezoid — wider at top, narrower at bottom)
  ctx.beginPath();
  ctx.moveTo(cx - bodyWidthTop, bodyTop);
  ctx.lineTo(cx + bodyWidthTop, bodyTop);
  ctx.lineTo(cx + bodyWidthBottom, bodyBottom);
  ctx.lineTo(cx - bodyWidthBottom, bodyBottom);
  ctx.closePath();
  ctx.fill();

  // Cut vertical lines into the body for detail (draw them as black)
  ctx.fillStyle = '#000000';
  const lineCount = 3;
  const lineWidth = s * 0.018;
  const lineInset = s * 0.06;
  const lineTop = bodyTop + lineInset;
  const lineBottom = bodyBottom - lineInset;

  for (let i = 0; i < lineCount; i++) {
    const t = (i + 1) / (lineCount + 1);
    const xTop = cx - bodyWidthTop + t * bodyWidthTop * 2;
    const xBot = cx - bodyWidthBottom + t * bodyWidthBottom * 2;
    ctx.beginPath();
    ctx.moveTo(xTop - lineWidth / 2, lineTop);
    ctx.lineTo(xTop + lineWidth / 2, lineTop);
    ctx.lineTo(xBot + lineWidth / 2, lineBottom);
    ctx.lineTo(xBot - lineWidth / 2, lineBottom);
    ctx.closePath();
    ctx.fill();
  }
}

export function initializeShapeCache() {
  if (isCacheInitialized) return;

  const canvas = document.createElement('canvas');
  canvas.width = BITMAP_SIZE;
  canvas.height = BITMAP_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    console.error("Could not create context for shape generation");
    return;
  }

  // Clear
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, BITMAP_SIZE, BITMAP_SIZE);

  // Draw trashcan
  drawTrashcan(ctx, BITMAP_SIZE);

  // Extract pixel mask
  const imgData = ctx.getImageData(0, 0, BITMAP_SIZE, BITMAP_SIZE);
  const pixels = imgData.data;
  const mask = new Uint8Array(BITMAP_SIZE * BITMAP_SIZE);
  for (let i = 0; i < pixels.length; i += 4) {
    mask[i / 4] = pixels[i] > 100 ? 1 : 0;
  }
  bitmapCache['trash'] = mask;

  isCacheInitialized = true;
}

export function isPointInShape(px: number, py: number, shape: Shape): boolean {
  const dx = px - shape.x;
  const dy = py - shape.y;

  const cos = Math.cos(-shape.rotation);
  const sin = Math.sin(-shape.rotation);
  const lx = (dx * cos) - (dy * sin);
  const ly = (dx * sin) + (dy * cos);

  const u = (lx / shape.size) + 0.5;
  const v = (ly / shape.size) + 0.5;

  if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;

  const mask = bitmapCache[shape.type];
  if (!mask) return false;

  const mapX = Math.floor(u * BITMAP_SIZE);
  const mapY = Math.floor(v * BITMAP_SIZE);

  const safeX = Math.max(0, Math.min(BITMAP_SIZE - 1, mapX));
  const safeY = Math.max(0, Math.min(BITMAP_SIZE - 1, mapY));

  return mask[safeY * BITMAP_SIZE + safeX] === 1;
}

export function generateInitialLayout(width: number, height: number): Shape[] {
  const count = 12;
  // Gorbagana brand palette — greens and purples
  const colors = [
    '#00ff00', // Neon Green — primary
    '#9945FF', // Oscar Purple
    '#00cc44', // Emerald
    '#FF00FF', // Magenta accent
    '#33ff66', // Light green
    '#7733ff', // Deep purple
    '#00ff88', // Mint
  ];

  const minDim = Math.min(width, height);
  const baseSize = minDim * 0.18;

  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const sizeVariation = 0.6 + Math.random() * 0.8;
    shapes.push({
      id: i,
      type: 'trash',
      x: Math.random() * width,
      y: Math.random() * height,
      dx: 0,
      dy: 0,
      size: baseSize * sizeVariation,
      rotation: (Math.random() - 0.5) * 0.4,
      rotationSpeed: 0,
      color: colors[i % colors.length],
    });
  }

  return shapes;
}