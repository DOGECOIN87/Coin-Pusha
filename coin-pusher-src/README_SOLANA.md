# Coin Pusher 2000 - Solana/Gorbagana dApp

**A thrilling 3D coin pusher game with real Solana blockchain integration**

[![Solana](https://img.shields.io/badge/Solana-14F195?logo=solana&logoColor=000)](https://solana.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-white?logo=three.js)](https://threejs.org)
[![Anchor](https://img.shields.io/badge/Anchor-0.30-9945FF?logo=anchor)](https://anchor-lang.com)

---

## 🎮 Features

### Game Mechanics
- **3D Physics Engine**: Real-time coin physics with Three.js + Rapier
- **Interactive UI**: Cyberpunk-themed HUD with Tailwind CSS
- **Score Tracking**: Real-time game statistics
- **Balance Management**: Track junk (in-game currency) and net profit

### Solana Integration  
- **Wallet Connection**: Wallet Standard discovery with framework-kit
- **On-Chain State**: Player balances, scores, and transactions stored on Gorbagana
- **Real Transactions**: Sign and broadcast SOL transfers for game actions
- **Event Streaming**: Listen to on-chain game events in real-time

---

## 📋 Quick Start

### Prerequisites
```
Node.js 18+
Rust 1.70+ (for program development)
Solana CLI v1.18+
Anchor 0.30+
```

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Gorbagana RPC settings

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### Build for Production

```bash
npm run build

# Outputs to: dist/
# Deploy to Vercel, Netlify, or your hosting provider
```

---

## 🚀 Solana Program Deployment

### Deploy to Gorbagana (Devnet)

```bash
# Build program
bash scripts/build-program.sh

# Deploy to Gorbagana
bash scripts/deploy-program.sh

# Expected output:
# ✨ DEPLOYMENT SUCCESSFUL!
# Program ID: 11111111111111111111111111111111
```

### Local Testing

```bash
# Run unit tests
cd programs/coin-pusher-game
cargo test --lib

# Test with LiteSVM (recommended for fast iteration)
cargo test --features test-bpf
```

---

## 🏗️ Architecture

### Frontend Stack
```
App.tsx (React 19)
  ├── WalletProvider (context)
  │   └── WalletContext (useWallet hook)
  ├── GameEngine (Three.js + Rapier)
  └── Overlay (UI components)
      ├── Wallet connection
      ├── Game stats display
      └── Bump transaction modal
```

### Smart Contract Stack
```
Program: coin-pusher-game (Anchor)
  ├── initialize_game()      → Create GameState
  ├── record_coin_collection() → Bump action
  ├── record_score()         → Score update
  ├── deposit_balance()      → Fund game
  └── withdraw_balance()     → Cashout
  
PDA Seeds: [b"game_state", player_pubkey]
```

---

## 📂 Project Structure

```
coin-pusher-src/
├── src/
│   ├── services/
│   │   ├── solanaService.ts       # RPC & wallet mgmt
│   │   └── transactionBuilder.ts  # TX construction
│   ├── sdk/
│   │   └── CoinPusherClient.ts    # Generated SDK
│   ├── context/
│   │   └── WalletContext.tsx      # Wallet provider
│   ├── components/
│   │   └── Overlay.tsx            # Game UI
│   ├── game/
│   │   ├── GameEngine.ts          # Physics engine
│   │   ├── constants.ts           # Game constants
│   │   └── types.ts               # Type definitions
│   ├── App.tsx                    # Root component
│   └── index.tsx                  # Entry point
├── programs/
│   └── coin-pusher-game/
│       ├── src/lib.rs             # Program logic
│       └── Cargo.toml
├── scripts/
│   ├── build-program.sh           # Compile Rust
│   ├── deploy-program.sh          # Deploy to Gorbagana
│   └── test-integration.sh        # E2E tests
├── idl/
│   └── coin-pusher-game.json      # IDL definition
├── .env.local                     # Config (in .gitignore)
├── SOLANA_INTEGRATION_GUIDE.md    # Full guide
└── package.json
```

---

## 🛠️ Development

### Environment Variables

Create `.env.local`:
```dotenv
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_CLUSTER=devnet
VITE_SOLANA_PROGRAM_ID=<YOUR_PROGRAM_ID>
```

### Development Workflow

```bash
# Terminal 1: Frontend dev server
npm run dev

# Terminal 2: Watch program (optional)
cd programs/coin-pusher-game
cargo watch -x build

# Browser DevTools: Check for wallet connection
# Console: localStorage.getItem('solana_pubkey')
```

### Making Changes

**Frontend**:
- Edit `.tsx` files in `src/`
- Changes hot-reload automatically via Vite
- No need to rebuild

**Smart Contract**:
1. Edit `programs/coin-pusher-game/src/lib.rs`
2. Run `cargo build`
3. Update IDL: `anchor idl fetch --provider.cluster devnet <PROG_ID> > idl/coin-pusher-game.json`
4. Deploy: `bash scripts/deploy-program.sh`

---

## 🧪 Testing

### Unit Tests (Smart Contract)

```bash
cd programs/coin-pusher-game
cargo test --lib

# With logging
RUST_LOG=debug cargo test --lib -- --nocapture
```

### Integration Tests (E2E)

```bash
# Deploy to devnet first
bash scripts/deploy-program.sh

# Run E2E test
bash scripts/test-integration.sh
```

### Manual Testing

1. **Wallet Connection**
   - Click "Connect Wallet"
   - Select MetaMask or Phantom
   - Approve connection

2. **Game Play**
   - Click on canvas to drop coins
   - Watch physics simulation
   - Balance increases with coin collection

3. **Bump Action (Out of Junk)**
   - Play until balance reaches 0
   - Click "PAY & BUMP" button
   - Approve transaction in wallet
   - Monitor transaction status

---

## 🔐 Security

### Smart Contract Security

✅ **Rate Limiting**: Minimum 1 second between transactions  
✅ **PDA Verification**: All account checks verify seed derivation  
✅ **Signer Validation**: Instructions require proper signer  
✅ **Input Validation**: All amounts checked > 0  
✅ **Atomic Updates**: State changes within single transaction  

### Audit Checklist

- [ ] No re-entrancy vulnerabilities (instruction-level isolation)
- [ ] PDA seeds properly constrained
- [ ] No unsigned integer overflows (use checked arithmetic)
- [ ] Proper error handling and messages
- [ ] Rate limiting prevents abuse

---

## 🚨 Troubleshooting

### "Insufficient balance for transaction"
```bash
# Airdrop testnet SOL
solana airdrop 2 --faucet-url https://faucet.solana.com
```

### "Program account not found"
```bash
# Verify program is deployed
solana program show <PROGRAM_ID>

# Check RPC endpoint
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

### "Wallet connection fails"
```bash
# Clear browser storage
# DevTools Console:
localStorage.clear()
sessionStorage.clear()

# Restart browser
```

### "Transaction simulation failed"
```bash
# Enable debug logging
ANCHOR_PROVIDER_DEBUG=1 npm run dev

# Check instruction accounts and order
# Verify recent blockhash freshness
```

---

## 📚 Resources

- [Solana Documentation](https://docs.solana.com)
- [Anchor Book](https://book.anchor-lang.com)
- [Wallet Standard](https://github.com/wallet-standard/wallet-standard)
- [Three.js Guide](https://threejs.org/docs/)
- [Rapier Physics](https://rapier.rs/)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 💬 Support

For issues or questions:
1. Check [SOLANA_INTEGRATION_GUIDE.md](./SOLANA_INTEGRATION_GUIDE.md)
2. Review [Troubleshooting](#troubleshooting) section
3. Check GitHub issues
4. Open new issue with full error context

---

**Built with ❤️ for Solana Gorbagana**

Last Updated: February 15, 2026  
Version: 3.0.0
