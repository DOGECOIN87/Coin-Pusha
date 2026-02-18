import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CHART_DATA, TRASH_GREEN } from '../../constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-trash-green p-2 text-xs font-mono">
        <p className="text-neutral-400">TIME: {label}</p>
        <p className="text-trash-green">VAL: {payload[0].value.toFixed(5)} G</p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col bg-trash-dark/30">
      <div className="flex justify-between items-center p-3 border-b border-trash-border">
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-neutral-800 rounded-sm flex items-center justify-center text-xs">🗑️</div>
                 <div>
                     <div className="text-sm font-bold text-white leading-none">TRASH / SOL</div>
                     <div className="text-[10px] text-trash-green">TRASHMARKET V2 POOL</div>
                 </div>
             </div>
             <div className="h-6 w-[1px] bg-trash-border mx-2"></div>
             <div className="flex flex-col">
                 <span className="text-[10px] text-neutral-500">PRICE</span>
                 <span className="text-xs font-bold text-trash-green">0.0178 G</span>
             </div>
             <div className="flex flex-col">
                 <span className="text-[10px] text-neutral-500">24H</span>
                 <span className="text-xs font-bold text-trash-red">-5.2%</span>
             </div>
             <div className="flex flex-col">
                 <span className="text-[10px] text-neutral-500">VOL</span>
                 <span className="text-xs font-bold text-neutral-300">12.5K G</span>
             </div>
         </div>

         <div className="flex gap-1">
             {['1H', '4H', '1D', '1W'].map((tf) => (
                 <button key={tf} className={`px-2 py-1 text-[10px] border border-trash-border hover:text-trash-green hover:border-trash-green transition-colors ${tf === '1H' ? 'text-trash-green border-trash-green bg-trash-green/10' : 'text-neutral-500'}`}>
                     {tf}
                 </button>
             ))}
         </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full relative group">
          <div className="absolute top-2 left-2 text-[10px] text-neutral-600 z-10 pointer-events-none">
              [ LIVE_FEED :: ACTIVE ]
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={TRASH_GREEN} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={TRASH_GREEN} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1A1A1A" vertical={false} />
              <XAxis 
                dataKey="time" 
                hide={true} 
              />
              <YAxis 
                orientation="right" 
                tick={{fontSize: 10, fill: '#555'}} 
                axisLine={false} 
                tickLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(val) => val.toFixed(4)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={TRASH_GREEN} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorVal)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;