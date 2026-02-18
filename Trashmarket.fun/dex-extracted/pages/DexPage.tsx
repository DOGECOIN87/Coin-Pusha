import React from 'react';
import Header from '../components/Header';
import Ticker from '../components/Ticker';
import PriceChart from '../components/dex/PriceChart';
import SwapInterface from '../components/dex/SwapInterface';
import OrderBook from '../components/dex/OrderBook';
import RecentTrades from '../components/dex/RecentTrades';

const DexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
      <Header />
      <Ticker />
      
      {/* Main Content Grid */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-88px)] overflow-hidden">
        
        {/* Left Column: Chart & Stats (Flexible width) */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-trash-border">
             {/* Chart takes up 65% of height */}
             <div className="flex-[2] border-b border-trash-border min-h-[300px]">
                <PriceChart />
             </div>
             
             {/* Bottom Left Panel: Order Book & Trades Split */}
             <div className="flex-1 flex min-h-[200px]">
                 <div className="flex-1 border-r border-trash-border">
                     <OrderBook />
                 </div>
                 <div className="flex-1 hidden md:block">
                     <RecentTrades />
                 </div>
             </div>
        </div>

        {/* Right Column: Swap Interface (Fixed Width on Desktop) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-trash-dark flex flex-col border-l border-trash-border">
             {/* Mobile Tabs could go here if responsive implementation was complex, but simple stacking works for now. 
                 On Mobile, this will be at bottom of scroll.
              */}
             <SwapInterface />
        </div>
      </main>
      
      {/* Mobile Footer Spacing if needed */}
      <div className="lg:hidden h-12"></div>
    </div>
  );
};

export default DexPage;