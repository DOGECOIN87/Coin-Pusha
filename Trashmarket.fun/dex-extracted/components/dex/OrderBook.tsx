import React from 'react';
import { MOCK_ASKS, MOCK_BIDS } from '../../constants';
import { Order } from '../../types';

const OrderRow = ({ price, amount, type }: Order) => (
    <div className="flex justify-between text-[10px] py-0.5 hover:bg-neutral-900 cursor-pointer relative group">
        <span className={`${type === 'ask' ? 'text-trash-red' : 'text-trash-green'}`}>{price.toFixed(5)}</span>
        <span className="text-neutral-400">{amount.toLocaleString()}</span>
        
        {/* Visual depth bar mock */}
        <div 
            className={`absolute top-0 bottom-0 right-0 opacity-10 ${type === 'ask' ? 'bg-red-500' : 'bg-green-500'}`} 
            style={{ width: `${Math.random() * 80}%` }}
        ></div>
    </div>
);

const OrderBook: React.FC = () => {
  return (
    <div className="h-full flex flex-col border-r border-trash-border bg-black/50">
      <div className="p-2 border-b border-trash-border flex justify-between items-center bg-neutral-950">
        <span className="text-xs font-bold text-neutral-300">ORDER_BOOK</span>
        <span className="text-[10px] text-neutral-600">SPREAD: 0.2%</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between px-2 py-1 text-[10px] text-neutral-600 border-b border-trash-border">
              <span>PRICE (G)</span>
              <span>SIZE (TRASH)</span>
          </div>

          {/* Asks (Sells) */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-1 flex flex-col justify-end">
             {MOCK_ASKS.map((order, i) => (
                 <OrderRow key={i} {...order} />
             ))}
          </div>

          {/* Current Price */}
          <div className="border-y border-trash-border py-1 px-2 flex justify-between items-center bg-neutral-900">
              <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">0.0178</span>
                  <span className="text-[10px] text-neutral-500">≈ $0.0031</span>
              </div>
              <span className="text-[10px] text-trash-green">●</span>
          </div>

          {/* Bids (Buys) */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-1">
             {MOCK_BIDS.map((order, i) => (
                 <OrderRow key={i} {...order} />
             ))}
          </div>
      </div>
    </div>
  );
};

export default OrderBook;