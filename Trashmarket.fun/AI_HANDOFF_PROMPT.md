# AI Assistant Handoff Prompt - TrashMarket.fun

## Project Context
TrashMarket.fun is a Gorbagana blockchain dApp (L2 on Solana) with NFT marketplace, DEX, bridge, and tools. Built with React + Vite + TailwindCSS.

**GitHub:** https://github.com/DOGECOIN87/Coin-Pusha
**Working Dir:** `/home/mattrick/Desktop/Coin-Pusha/Trashmarket.fun/`

---

## COMPLETED WORK

### ✅ Vanity Address Generator (NEW)
- **Page:** `pages/VanityGenerator.tsx` - Full visual UI with pattern builder
- **Worker:** `workers/vanityMiner.worker.ts` - Web Worker for parallel keypair mining
- **Manager:** `lib/workerManager.ts` - Multi-threaded worker coordination
- **Route:** `/vanity` added to App.tsx
- **Navbar:** Link added to navigation
- **Features:** Character variant grid, difficulty estimation, Base58 substitutions, pricing tiers

### ✅ DEX UI (Partial)
- **Page:** `pages/Dex.tsx` - Swap interface, token selector, pool table
- **Service:** `services/dexService.ts` - API integration with gorapi.trashscan.io
- **Data:** Tokens, markets, price calculations working
- **MISSING:** Actual swap execution with wallet integration

---

## IMMEDIATE TODO - DEX Swap Execution

### 1. Add Swap Service (`services/swapService.ts`)
Create swap execution with 0.5% service fee:

```typescript
// Key requirements:
- Treasury wallet: TMABDMgLHfmmRNyHgbHTP9P5XP1zrAMFfbRAef69o9f
- Service fee: 0.5% of input amount
- Build transaction with: swap instruction + fee transfer instruction
- Use Trashbin CPAMM programs from Gorbagana
```

### 2. Gorbagana AMM Program IDs (from trashscan.io/programs)
```
Trashbin Dex CPAMM v1: xYBN2zddsqSy41tg1yD9nJScCmqquZnHUyzXBfLEqC8
Trashbin Dex CPAMM v2: 5cYqbWRziT7dNi8Nb5poJr7nSuuocREj9SfBiuUYVVqc
Trashbin Dex CPAMM v3: 6Y3VJBWqFvDkSBdT3Pcb3DNaJ7cA1JPHAiLfo7JhyFq
Meteora DAMMv2 Fork: cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG
```

### 3. Update Dex.tsx
- Import `useWallet` from `../contexts/WalletContext`
- Show user's token balances
- Replace alert() with actual `executeSwap()` call
- Display transaction status/signature

### 4. Transaction Building Pattern
```typescript
// services/swapService.ts
import { Connection, Transaction, PublicKey } from '@solana/web3.js';

const TREASURY_WALLET = new PublicKey('TMABDMgLHfmmRNyHgbHTP9P5XP1zrAMFfbRAef69o9f');
const SERVICE_FEE_PERCENT = 0.005; // 0.5%

export async function executeSwap(
  connection: Connection,
  wallet: WalletAdapter,
  inputToken: PublicKey,
  outputToken: PublicKey,
  amount: number,
  poolAddress: PublicKey,
  poolType: 'CPAMM' | 'DAMM'
): Promise<string> {
  // 1. Calculate fee
  const feeAmount = amount * SERVICE_FEE_PERCENT;
  const swapAmount = amount - feeAmount;
  
  // 2. Build transaction
  const tx = new Transaction();
  
  // Add fee transfer to treasury
  tx.add(createTransferInstruction(..., TREASURY_WALLET, feeAmount));
  
  // Add swap instruction based on pool type
  if (poolType === 'CPAMM') {
    tx.add(createCPAMMSwapInstruction(poolAddress, swapAmount, ...));
  }
  
  // 3. Sign and send
  const signature = await wallet.sendTransaction(tx, connection);
  return signature;
}
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `pages/Dex.tsx` | DEX swap interface (needs wallet integration) |
| `pages/VanityGenerator.tsx` | Vanity address miner page |
| `services/dexService.ts` | API calls to gorapi.trashscan.io |
| `lib/workerManager.ts` | Web Worker manager for CPU tasks |
| `workers/vanityMiner.worker.ts` | Keypair generation worker |
| `contexts/WalletContext.tsx` | Wallet state (Backpack/Gorbag) |
| `contexts/NetworkContext.tsx` | Network config (Gorbagana RPC) |

---

## Network Configuration

```typescript
// Gorbagana L2 (Solana fork)
RPC: https://rpc.gorbagana.wtf
Explorer: https://trashscan.io
API: https://gorapi.trashscan.io
Currency: GOR (9 decimals, like SOL)
```

---

## Wallet Integration Notes
- Uses `@solana/wallet-adapter-react` with custom Gorbagana RPC
- `WalletContext.tsx` has custom implementation for balance fetching
- Supports Backpack and Gorbag wallets
- Keypairs are Solana-compatible (Base58 addresses)

---

## Testing the App
```bash
cd /home/mattrick/Desktop/Coin-Pusha/Trashmarket.fun
pnpm install  # or npm install
pnpm dev      # runs on localhost:3000
```

---

## Priority Order
1. **Complete DEX swap execution** with 0.5% service fee
2. **Add payment flow** to VanityGenerator unlock buttons
3. **Test end-to-end** swap and vanity generation

---

## Additional Context Files
- `program-id.txt` - All Gorbagana program IDs
- `Trashmarket.fun/task_progress.md` - Original task checklist
- `Trashmarket.fun/HANDOFF_SUMMARY.md` - Previous handoff notes
