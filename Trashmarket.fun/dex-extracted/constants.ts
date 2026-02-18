import { Token, Trade, Order } from './types';

export const TRASH_GREEN = '#ADFF02';
export const TRASH_RED = '#FF2222';
export const TRASH_DARK = '#080808';

export const MOCK_TOKENS: Token[] = [
  { symbol: 'SOL', name: 'Solana', balance: 14.5, price: 145.20, change24h: 2.4 },
  { symbol: 'TRASH', name: 'TrashCoin', balance: 1420000, price: 0.0178, change24h: -5.2 },
  { symbol: 'GOR', name: 'Gorbagios', balance: 250, price: 400.0, change24h: 12.5 },
  { symbol: 'RAC', name: 'Raccoon', balance: 0, price: 1.25, change24h: 0.8 },
  { symbol: 'SCRAP', name: 'Scrap Metal', balance: 5000, price: 0.004, change24h: -1.1 },
];

export const MOCK_TRADES: Trade[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `t-${i}`,
  price: 0.0178 + (Math.random() * 0.0004 - 0.0002),
  amount: Math.floor(Math.random() * 10000) + 100,
  time: new Date(Date.now() - i * 1000 * 60).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  type: Math.random() > 0.5 ? 'buy' : 'sell'
}));

export const MOCK_ASKS: Order[] = Array.from({ length: 15 }).map((_, i) => ({
  price: 0.0180 + (i * 0.0001),
  amount: Math.floor(Math.random() * 5000) + 100,
  total: 0,
  type: 'ask' as const
})).reverse();

export const MOCK_BIDS: Order[] = Array.from({ length: 15 }).map((_, i) => ({
  price: 0.0178 - (i * 0.0001),
  amount: Math.floor(Math.random() * 5000) + 100,
  total: 0,
  type: 'bid' as const
}));

// Mock chart data
export const CHART_DATA = Array.from({ length: 100 }).map((_, i) => {
  const basePrice = 0.0178;
  const randomFactor = Math.sin(i / 5) * 0.002 + (Math.random() * 0.001);
  return {
    time: i,
    value: basePrice + randomFactor,
    vol: Math.random() * 1000
  };
});