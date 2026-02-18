import React, { useState, useEffect } from 'react';
import { Settings, ArrowDownUp, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { getTokens, Token } from '../services/tokenService';

const DexPage: React.FC = () => {
  const { connected, connect, disconnect } = useWallet();
  
  // State for tokens from API
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Swap state
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [payToken, setPayToken] = useState<Token | null>(null);
  const [receiveToken, setReceiveToken] = useState<Token | null>(null);
  const [slippage, setSlippage] = useState('1.0');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Fetch tokens from API on mount
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const fetchedTokens = await getTokens();
        setTokens(fetchedTokens);
        
        // Set default tokens
        if (fetchedTokens.length >= 2) {
          setPayToken(fetchedTokens[0]);
          setReceiveToken(fetchedTokens[1]);
        }
      } catch (err) {
        console.error('Failed to fetch tokens:', err);
        setError('Failed to load token data');
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
  }, []);

  // Calculate exchange rate
  const getExchangeRate = () => {
    if (!payToken || !receiveToken || !payToken.price || !receiveToken.price) return 0;
    return payToken.price / receiveToken.price;
  };

  // Handle swap
  const handleSwap = () => {
    if (!payToken || !receiveToken) return;
    const temp = payToken;
    setPayToken(receiveToken);
    setReceiveToken(temp);
    setPayAmount(receiveAmount);
    setReceiveAmount(payAmount);
  };

  // Handle pay amount change
  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPayAmount(val);
    
    if (val && !isNaN(Number(val)) && payToken && receiveToken) {
      const rate = getExchangeRate();
      setReceiveAmount((Number(val) * rate).toFixed(6));
    } else {
      setReceiveAmount('');
    }
  };

  // Handle execute swap
  const handleExecuteSwap = async () => {
    if (!connected) {
      await connect();
      return;
    }
    
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      alert('Swap functionality - Connect to wallet and integrate with DEX contract');
    }, 1000);
  };

  // Get token balance (mock for now)
  const getTokenBalance = (token: Token | null) => {
    if (!token) return '0';
    return token.symbol === 'SOL' ? '14.5' : '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-magic-green animate-pulse uppercase tracking-widest">
          Loading DEX Data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-magic-green tracking-tighter">TRASH DEX</h1>
            <span className="text-[10px] text-gray-500 border border-gray-800 px-2 py-0.5">V1.0</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <span className="w-2 h-2 bg-magic-green rounded-full animate-pulse"></span>
              API: gorapi.trashcan.io
            </div>
            <button 
              onClick={connected ? disconnect : connect}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${
                connected 
                  ? 'border-magic-red text-magic-red hover:bg-magic-red/10' 
                  : 'border-magic-green text-magic-green hover:bg-magic-green/10'
              }`}
            >
              {connected ? 'Disconnect' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="border-b border-white/10 bg-black overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-2">
          {tokens.slice(0, 10).map((token, i) => (
            <div key={i} className="flex items-center gap-2 mx-6 text-[10px]">
              <span className="text-white font-bold">{token.symbol}</span>
              <span className="text-gray-400">${token.price?.toFixed(6) || '0'}</span>
              <span className={token.change24h >= 0 ? 'text-magic-green' : 'text-magic-red'}>
                {token.change24h >= 0 ? <TrendingUp size={12} className="inline" /> : <TrendingDown size={12} className="inline" />}
                {' '}{token.change24h?.toFixed(2) || '0'}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        
        {/* Left - Price Chart & Order Book */}
        <div className="flex-1 flex flex-col border-r border-white/10 min-w-0">
          {/* Price Chart Area */}
          <div className="flex-[2] border-b border-white/10 p-4 min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">{payToken?.symbol || 'Select'}/{receiveToken?.symbol || 'Token'}</h2>
                <p className="text-[10px] text-gray-500">Live Price from RPC</p>
              </div>
              <div className="flex gap-2">
                {['1H', '4H', '1D', '1W'].map(tf => (
                  <button key={tf} className="px-3 py-1 text-[10px] border border-gray-800 text-gray-500 hover:border-magic-green hover:text-magic-green">
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[200px] flex items-center justify-center border border-dashed border-gray-800 text-gray-600 text-sm">
              Price Chart (Connect to TradingView API)
            </div>
          </div>

          {/* Order Book */}
          <div className="flex-1 flex min-h-[200px]">
            <div className="flex-1 border-r border-white/10 p-2 overflow-hidden">
              <div className="text-[10px] text-gray-500 mb-2 uppercase">ASKS</div>
              <div className="space-y-0.5 text-[10px]">
                {tokens.slice(0, 5).map((token, i) => (
                  <div key={i} className="flex justify-between text-magic-red">
                    <span>${token.price?.toFixed(6)}</span>
                    <span className="text-gray-500">{token.volume24h?.toFixed(0) || '0'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 p-2 overflow-hidden">
              <div className="text-[10px] text-gray-500 mb-2 uppercase">BIDS</div>
              <div className="space-y-0.5 text-[10px]">
                {tokens.slice(0, 5).map((token, i) => (
                  <div key={i} className="flex justify-between text-magic-green">
                    <span>${(token.price * 0.999)?.toFixed(6)}</span>
                    <span className="text-gray-500">{(token.volume24h * 0.5)?.toFixed(0) || '0'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Swap Interface */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-gray-900 flex flex-col border-l border-white/10 p-4">
          {/* Swap Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">SWAP_TOKEN</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setPayAmount('')} className="text-gray-500 hover:text-white transition-colors">
                <RefreshCw size={14} />
              </button>
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`transition-colors ${isSettingsOpen ? 'text-magic-green' : 'text-gray-500 hover:text-white'}`}>
                <Settings size={14} />
              </button>
            </div>
          </div>

          {/* Settings */}
          {isSettingsOpen && (
            <div className="mb-4 p-3 border border-gray-700 bg-black/50 text-[10px]">
              <div className="flex justify-between mb-2 text-gray-400">
                <span>MAX_SLIPPAGE</span>
                <span className="text-magic-green">{slippage}%</span>
              </div>
              <div className="flex gap-2">
                {['0.1', '0.5', '1.0', '2.5'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSlippage(s)}
                    className={`flex-1 py-1 border ${slippage === s ? 'border-magic-green text-magic-green bg-magic-green/10' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pay Input */}
          <div className="space-y-1 mb-1">
            <div className="flex justify-between text-[10px] text-gray-500 px-1">
              <span>YOU_PAY</span>
              <span>BAL: {getTokenBalance(payToken)}</span>
            </div>
            <div className="bg-black border border-gray-700 p-3 focus-within:border-magic-green transition-colors group relative">
              <div className="flex justify-between items-center">
                <input 
                  type="number" 
                  value={payAmount}
                  onChange={handlePayChange}
                  placeholder="0.00"
                  className="bg-transparent border-none outline-none text-2xl font-bold text-white w-2/3 placeholder-gray-800"
                />
                <div className="flex items-center gap-2 bg-gray-900 px-2 py-1 border border-gray-800 rounded-sm cursor-pointer hover:border-gray-600">
                  <span className="font-bold text-sm">{payToken?.symbol || 'Select'}</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                ≈ ${payAmount ? (Number(payAmount) * (payToken?.price || 0)).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>

          {/* Switcher */}
          <div className="flex justify-center my-6 relative z-10">
            <button 
              onClick={handleSwap}
              className="bg-gray-900 border border-gray-700 p-1.5 rounded-sm hover:border-magic-green hover:text-magic-green transition-all active:scale-95"
            >
              <ArrowDownUp size={16} className="text-gray-400" />
            </button>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-800 -z-10"></div>
          </div>

          {/* Receive Input */}
          <div className="space-y-1 mb-6">
            <div className="flex justify-between text-[10px] text-gray-500 px-1">
              <span>YOU_RECEIVE</span>
              <span>BAL: {getTokenBalance(receiveToken)}</span>
            </div>
            <div className="bg-black border border-gray-700 p-3 focus-within:border-magic-green transition-colors">
              <div className="flex justify-between items-center">
                <input 
                  type="number" 
                  value={receiveAmount}
                  readOnly
                  placeholder="0.00"
                  className="bg-transparent border-none outline-none text-2xl font-bold text-white w-2/3 placeholder-gray-800"
                />
                <div className="flex items-center gap-2 bg-gray-900 px-2 py-1 border border-gray-800 rounded-sm cursor-pointer hover:border-gray-600">
                  <span className="font-bold text-sm">{receiveToken?.symbol || 'Select'}</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                ≈ ${receiveAmount ? (Number(receiveAmount) * (receiveToken?.price || 0)).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>

          {/* Info Box */}
          {payAmount && (
            <div className="mb-4 p-2 bg-gray-900/50 border border-gray-700 text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">RATE</span>
                <span className="text-gray-300">1 {payToken?.symbol} ≈ {getExchangeRate().toFixed(4)} {receiveToken?.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PRICE_IMPACT</span>
                <span className="text-magic-green">{'< 0.01%'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ROUTE</span>
                <span className="text-gray-300">{payToken?.symbol} {'>'} {receiveToken?.symbol}</span>
              </div>
            </div>
          )}

          <button 
            onClick={handleExecuteSwap}
            className="w-full bg-magic-green text-black font-bold py-3 text-sm hover:bg-white transition-colors relative overflow-hidden group"
            disabled={isSwapping}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSwapping ? 'Processing...' : connected ? 'EXECUTE_SWAP' : 'CONNECT_WALLET'}
            </span>
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600">
            <AlertTriangle size={10} />
            <span>ALWAYS_CHECK_URL_BEFORE_APEING</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DexPage;