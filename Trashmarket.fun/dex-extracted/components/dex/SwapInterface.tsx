import React, { useState } from 'react';
import { Settings, ArrowDownUp, RefreshCw, AlertTriangle } from 'lucide-react';
import { MOCK_TOKENS } from '../../constants';

const SwapInterface: React.FC = () => {
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [payToken, setPayToken] = useState(MOCK_TOKENS[0]); // SOL
  const [receiveToken, setReceiveToken] = useState(MOCK_TOKENS[1]); // TRASH
  const [slippage, setSlippage] = useState('1.0');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSwap = () => {
     const temp = payToken;
     setPayToken(receiveToken);
     setReceiveToken(temp);
     setPayAmount(receiveAmount);
     setReceiveAmount(payAmount);
  };

  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setPayAmount(val);
      // Mock calculation
      if(val && !isNaN(Number(val))) {
         const rate = 145.20 / 0.0178; // Mock rate SOL -> TRASH
         setReceiveAmount((Number(val) * rate).toFixed(2));
      } else {
         setReceiveAmount('');
      }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-trash-dark border-l border-trash-border relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-trash-green/5 blur-[80px] pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">SWAP_TOKEN</h2>
            <div className="flex items-center gap-2">
                 <button onClick={() => setPayAmount('')} className="text-neutral-500 hover:text-white transition-colors">
                    <RefreshCw size={14} />
                 </button>
                 <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`transition-colors ${isSettingsOpen ? 'text-trash-green' : 'text-neutral-500 hover:text-white'}`}>
                    <Settings size={14} />
                 </button>
            </div>
        </div>

        {isSettingsOpen && (
            <div className="mb-4 p-3 border border-trash-border bg-black/50 text-[10px]">
                <div className="flex justify-between mb-2 text-neutral-400">
                    <span>MAX_SLIPPAGE</span>
                    <span className="text-trash-green">{slippage}%</span>
                </div>
                <div className="flex gap-2">
                    {['0.1', '0.5', '1.0', '2.5'].map(s => (
                        <button 
                            key={s} 
                            onClick={() => setSlippage(s)}
                            className={`flex-1 py-1 border ${slippage === s ? 'border-trash-green text-trash-green bg-trash-green/10' : 'border-trash-border text-neutral-500 hover:border-neutral-500'}`}
                        >
                            {s}%
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Pay Input */}
        <div className="space-y-1 mb-1">
            <div className="flex justify-between text-[10px] text-neutral-500 px-1">
                <span>YOU_PAY</span>
                <span>BAL: {payToken.balance.toLocaleString()}</span>
            </div>
            <div className="bg-black border border-trash-border p-3 focus-within:border-trash-green transition-colors group relative">
                 <div className="flex justify-between items-center">
                    <input 
                        type="number" 
                        value={payAmount}
                        onChange={handlePayChange}
                        placeholder="0.00"
                        className="bg-transparent border-none outline-none text-2xl font-bold text-white w-2/3 placeholder-neutral-800"
                    />
                    <div className="flex items-center gap-2 bg-neutral-900 px-2 py-1 border border-neutral-800 rounded-sm cursor-pointer hover:border-neutral-600">
                        {/* Token Icon Placeholder */}
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-trash-green to-black"></div>
                        <span className="font-bold text-sm">{payToken.symbol}</span>
                    </div>
                 </div>
                 <div className="text-[10px] text-neutral-600 mt-1">
                    ≈ ${payAmount ? (Number(payAmount) * payToken.price).toFixed(2) : '0.00'}
                 </div>
                 
                 {/* Quick amount buttons */}
                 <div className="absolute bottom-[-24px] left-0 flex gap-1">
                     {['25%', '50%', 'MAX'].map(p => (
                         <button key={p} className="text-[9px] bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-neutral-400 hover:text-trash-green hover:border-trash-green transition-colors">
                             {p}
                         </button>
                     ))}
                 </div>
            </div>
        </div>

        {/* Spacer / Switcher */}
        <div className="flex justify-center my-6 relative z-10">
            <button 
                onClick={handleSwap}
                className="bg-trash-dark border border-trash-border p-1.5 rounded-sm hover:border-trash-green hover:text-trash-green transition-all active:scale-95"
            >
                <ArrowDownUp size={16} className="text-neutral-400" />
            </button>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-trash-border -z-10"></div>
        </div>

        {/* Receive Input */}
        <div className="space-y-1 mb-6">
            <div className="flex justify-between text-[10px] text-neutral-500 px-1">
                <span>YOU_RECEIVE</span>
                <span>BAL: {receiveToken.balance.toLocaleString()}</span>
            </div>
            <div className="bg-black border border-trash-border p-3 focus-within:border-trash-green transition-colors">
                 <div className="flex justify-between items-center">
                    <input 
                        type="number" 
                        value={receiveAmount}
                        readOnly
                        placeholder="0.00"
                        className="bg-transparent border-none outline-none text-2xl font-bold text-white w-2/3 placeholder-neutral-800"
                    />
                    <div className="flex items-center gap-2 bg-neutral-900 px-2 py-1 border border-neutral-800 rounded-sm cursor-pointer hover:border-neutral-600">
                         <div className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center text-[8px]">🗑️</div>
                        <span className="font-bold text-sm">{receiveToken.symbol}</span>
                    </div>
                 </div>
                  <div className="text-[10px] text-neutral-600 mt-1">
                    ≈ ${receiveAmount ? (Number(receiveAmount) * receiveToken.price).toFixed(2) : '0.00'}
                 </div>
            </div>
        </div>

        {/* Info Box */}
        {payAmount && (
             <div className="mb-4 p-2 bg-neutral-900/50 border border-trash-border text-[10px] space-y-1">
                 <div className="flex justify-between">
                     <span className="text-neutral-500">RATE</span>
                     <span className="text-neutral-300">1 SOL ≈ 8,157.30 TRASH</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-neutral-500">PRICE_IMPACT</span>
                     <span className="text-trash-green text-opacity-80">{'< 0.01%'}</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-neutral-500">ROUTE</span>
                     <span className="text-neutral-300">SOL {'>'} RAYDIUM {'>'} TRASH</span>
                 </div>
             </div>
        )}

        <button className="w-full bg-trash-green text-black font-bold py-3 text-sm hover:bg-white transition-colors relative overflow-hidden group">
            <span className="relative z-10 flex items-center justify-center gap-2">
                EXECUTE_SWAP
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-600">
             <AlertTriangle size={10} />
             <span>ALWAYS_CHECK_URL_BEFORE_APEING</span>
        </div>
    </div>
  );
};

export default SwapInterface;