import React from 'react';

const TickerItem = ({ label, value, change }: { label: string, value: string, change: number }) => (
  <div className="flex items-center gap-2 text-[10px] font-mono mx-4 whitespace-nowrap">
    <span className="text-neutral-500">{label}</span>
    <span className="text-trash-green">{value}</span>
    <span className={`${change >= 0 ? 'text-neutral-400' : 'text-trash-red'}`}>{change}%</span>
    <span className="text-trash-border">/</span>
  </div>
);

const Ticker: React.FC = () => {
  return (
    <div className="w-full bg-black border-b border-trash-border overflow-hidden h-8 flex items-center relative z-40">
      <div className="absolute flex animate-marquee hover:pause whitespace-nowrap">
        <TickerItem label="TLOCK" value="G 1.31" change={0} />
        <TickerItem label="GONZO" value="G 0.3957" change={0} />
        <TickerItem label="BILLI" value="G 0.0480" change={0} />
        <TickerItem label="SPP" value="G 0.2807" change={0} />
        <TickerItem label="TRASH" value="G 0.0178" change={0} />
        <TickerItem label="BB" value="G 0.0019" change={0} />
        <TickerItem label="GORSKI" value="G 1.80" change={0} />
        <TickerItem label="WIGBEEK" value="G 0.0016" change={0} />
        <TickerItem label="GORBHOUSE" value="G 0.0012" change={0} />
        {/* Repeat for seamless loop effect visually if needed, but CSS handles standard loop */}
        <TickerItem label="TLOCK" value="G 1.31" change={0} />
        <TickerItem label="GONZO" value="G 0.3957" change={0} />
        <TickerItem label="BILLI" value="G 0.0480" change={0} />
        <TickerItem label="SPP" value="G 0.2807" change={0} />
        <TickerItem label="TRASH" value="G 0.0178" change={0} />
      </div>
      
      {/* Overlay Gradients for smooth fade if desired, but Trash style is usually stark hard edges */}
    </div>
  );
};

export default Ticker;