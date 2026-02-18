import React from 'react';
import { Search, Globe, Wallet, Menu } from 'lucide-react';
import { TRASH_GREEN } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="border-b border-trash-border bg-black font-mono sticky top-0 z-50">
      {/* Top Status Bar (Hidden on Mobile usually, but let's keep it responsive) */}
      <div className="hidden lg:flex justify-between items-center px-4 py-1 text-[10px] text-neutral-500 border-b border-trash-border bg-trash-dark">
        <div className="flex space-x-4">
           <span>GORBAGANA_L2 :: <span className="text-trash-red">CLOGGED</span> 6,915 tps</span>
           <span>GPS :: <span className="text-trash-green">FLOWING</span> 7,039</span>
        </div>
        <div className="flex space-x-4">
          <span>GAS <span className="text-blue-400">0.001 G</span> LOW</span>
          <span>SYSTEM_ONLINE [ AI_LAUNCHPAD_ACTIVE ]</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-trash-green text-black w-8 h-8 flex items-center justify-center font-bold text-lg rounded-sm group-hover:invert transition-all">
              T
            </div>
            <span className="font-bold text-xl tracking-tighter hidden sm:block">
              TRASHMARKET<span className="text-trash-green">.FUN</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center border border-trash-border bg-trash-dark px-3 py-1.5 w-64 focus-within:border-trash-green transition-colors">
            <Search size={14} className="text-neutral-500 mr-2" />
            <input 
              type="text" 
              placeholder="SEARCH_TRASH..." 
              className="bg-transparent border-none outline-none text-xs w-full text-trash-green placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Center: Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-bold tracking-wide text-neutral-400">
          <a href="#" className="hover:text-trash-green transition-colors">COLLECTIONS</a>
          <a href="#" className="hover:text-trash-green transition-colors">GORID</a>
          <a href="#" className="text-trash-green">DEX</a>
          <a href="#" className="hover:text-trash-green transition-colors">BRIDGE</a>
          <a href="#" className="hover:text-trash-green transition-colors">FAUCET</a>
          <a href="#" className="hover:text-trash-green transition-colors">DOCS / BRAND</a>
        </nav>

        {/* Right: Connect */}
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 border border-trash-border px-3 py-1.5 bg-trash-dark text-xs hover:border-neutral-600 cursor-pointer">
                <Globe size={14} className="text-neutral-400" />
                <span className="text-trash-green">GOR</span>
                <span className="text-neutral-500 text-[10px]">▼</span>
            </div>

            <button className="bg-trash-green text-black px-4 py-1.5 text-xs font-bold flex items-center gap-2 hover:bg-white transition-colors">
                <Wallet size={14} />
                CONNECT
            </button>
            
            <button className="xl:hidden text-white">
                <Menu size={24} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;