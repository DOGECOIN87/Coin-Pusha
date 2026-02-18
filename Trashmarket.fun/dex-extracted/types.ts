export interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  change24h: number;
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

export interface Order {
  price: number;
  amount: number;
  total: number;
  type: 'bid' | 'ask';
}