import React from 'react';
import { MOCK_TRADES } from '../../constants';

const RecentTrades: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-black/50">
        <div className="p-2 border-b border-trash-border bg-neutral-950">
            <span className="text-xs font-bold text-neutral-300">RECENT_TRADES</span>
        </div>
        
        <div className="flex justify-between px-2 py-1 text-[10px] text-neutral-600 border-b border-trash-border">
            <span>PRICE</span>
            <span>AMT</span>
            <span>TIME</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-1">
            {MOCK_TRADES.map((trade) => (
                <div key={trade.id} className="flex justify-between text-[10px] py-0.5 hover:bg-neutral-900">
                    <span className={trade.type === 'buy' ? 'text-trash-green' : 'text-trash-red'}>
                        {trade.price.toFixed(5)}
                    </span>
                    <span className="text-neutral-300">{trade.amount.toLocaleString()}</span>
                    <span className="text-neutral-500">{trade.time}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default RecentTrades;