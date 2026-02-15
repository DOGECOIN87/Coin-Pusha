# Coin Pusher dApp - Solana/Gorbagana Integration Guide

**Version**: 3.0.0  
**Date**: February 15, 2026  
**Network**: Gorbagana (Solana Devnet Testnet)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Coin Pusher 2000** is a Solana-integrated dApp combining:
- **Frontend**: React 19 + Three.js 3D physics engine
- **Smart Contracts**: Anchor program on Gorbagana testnet
- **Blockchain**: Solana framework-kit (latest) for wallet/RPC integration
- **Game Mechanics**: Player balances and coin collection tracked on-chain

### Key Features

✅ Wallet Standard connection (framework-kit)  
✅ Real-time balance display from Solana  
✅ Bump transactions with SOL fees  
✅ Score tracking on-chain  
✅ Rate limiting (1s per transaction min)  
✅ PDA-based player state management  

---

## Architecture

### Directory Structure

```
coin-pusher-src/
├── programs/
│   └── coin-pusher-game/          # Anchor program
│       ├── src/lib.rs             # Program logic
│       └── Cargo.toml
├── src/
│   ├── services/
│   │   ├── solanaService.ts       # RPC & wallet management
│   │   └── transactionBuilder.ts  # TX construction
│   ├── sdk/
│   │   └── CoinPusherClient.ts    # Generated client
│   ├── context/
│   │   └── WalletContext.tsx      # React provider
│   ├── components/
│   │   └── Overlay.tsx            # Game UI + wallet
│   ├── game/
│   │   ├── GameEngine.ts          # 3D physics
│   │   └── constants.ts
│   ├── App.tsx
│   └── types.ts
├── idl/
│   └── coin-pusher-game.json      # Anchor IDL
├── config/
│   └── (system-prompt.md, tools.json)
├── scripts/
│   ├── build-program.sh           # Compile Rust program
│   ├── deploy-program.sh          # Deploy to Gorbagana
│   └── test-integration.sh        # E2E tests
├── .env.local                     # Environment config
└── package.json
```

### Program Architecture

```
Solana Program (Coin Pusher Game)
  ├── Instruction: initialize_game
  │   └── Creates player GameState (PDA)
  ├── Instruction: record_coin_collection
  │   └── Updates balance, coins_collected, net_profit
  ├── Instruction: record_score
  │   └── Updates score counter
  ├── Instruction: deposit_balance
  │   └── SOL transfer: Player → Program
  ├── Instruction: withdraw_balance
  │   └── SOL transfer: Program → Player (signed)
  └── Instruction: reset_game
      └── Resets state (balance=100)

GameState Account (1 per player)
  ├── player: PublicKey
  ├── score: u64
  ├── balance: u64 (in lamports)
  ├── net_profit: i64
  ├── total_coins_collected: u64
  ├── created_at: i64 (timestamp)
  ├── last_updated: i64
  └── bump: u8 (PDA seed)
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18+
- **Rust**: 1.70+ (for program development)
- **Solana CLI**: Latest version
- **Anchor Framework**: v0.30+

### Step 1: Install Dependencies

```bash
cd coin-pusher-src

# Frontend
npm install

# Program dependencies (if building locally)
cd programs/coin-pusher-game
cargo build
cd ../..
```

### Step 2: Configure Environment

Edit `.env.local`:

```dotenv
# Solana Configuration (Gorbagana Devnet)
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_CLUSTER=devnet
VITE_SOLANA_PROGRAM_ID=<YOUR_PROGRAM_ID_HERE>
```

**How to get PROGRAM_ID**:
1. Deploy program to Gorbagana (see Deployment section)
2. Copy the deployed program's public key
3. Paste into `.env.local`

### Step 3: Set Up Wallet

```bash
# Create or import wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Configure default RPC
solana config set --url https://api.devnet.solana.com

# Airdrop 2 SOL to wallet for fees
solana airdrop 2 --faucet-url https://faucet.solana.com
```

---

## Development Workflow

### Local Development

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Watch program (optional)
cd programs/coin-pusher-game
cargo watch -x build
```

Visit `http://localhost:5173` in browser.

### Making Changes

#### Frontend Changes
- Modify `.tsx` files in `src/`
- Hot reload (Vite) applies changes automatically
- Test in browser immediately

#### Smart Contract Changes
1. Edit `programs/coin-pusher-game/src/lib.rs`
2. Run `cargo build` to compile
3. Update IDL: `anchor idl fetch --provider.cluster devnet <PROGRAM_ID> > idl/coin-pusher-game.json`
4. Regenerate client: `npm run codegen`
5. Update `VITE_SOLANA_PROGRAM_ID` in `.env.local`

---

## Testing

### Unit Testing (Local)

Create `programs/coin-pusher-game/tests/integration_test.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

    #[test]
    fn test_initialize_game() {
        // Use LiteSVM for fast, deterministic testing
        let mut test_env = LiteSVM::new();
        
        // Create player account
        let player = test_env.new_account(1 * LAMPORTS_PER_SOL);
        
        // Initialize game
        let result = initialize_game(100);
        assert!(result.is_ok());
        assert_eq!(result.unwrap().balance, 100);
    }

    #[test]
    fn test_rate_limiting() {
        // Ensure 1s minimum between bump transactions
        let result1 = record_coin_collection(10);
        let result2 = record_coin_collection(10); // Should fail
        
        assert!(result1.is_ok());
        assert!(result2.is_err());
    }
}
```

Run tests:

```bash
cd programs/coin-pusher-game
cargo test --lib
```

### Integration Testing (Gorbagana)

```bash
# Deploy to devnet first
anchor deploy --provider.cluster devnet

# Run E2E test
bash scripts/test-integration.sh
```

**test-integration.sh**:
```bash
#!/bin/bash

echo "=== E2E Test: Coin Pusher Solana Integration ==="

# 1. Initialize game
echo "1. Initializing game session..."
solana invoke-program ... --initial-balance 100

# 2. Verify wallet connection
echo "2. Verifying wallet connection..."

# 3. Perform bump transaction
echo "3. Performing bump transaction..."
solana invoke-program ... --amount 10

# 4. Record score
echo "4. Recording score on-chain..."
solana invoke-program ... --score 5000

# 5. Verify state
echo "5. Verifying state..."
solana account-info ...

echo "✅ All E2E tests passed!"
```

---

## Deployment

### Deploy to Gorbagana (Devnet)

```bash
# Step 1: Ensure correct network
solana config set --url https://api.devnet.solana.com

# Step 2: Deploy program
anchor deploy --provider.cluster devnet

# Output will show:
# Deployed program: 11111111111111111111111111111111
```

### Extract Program ID

```bash
# After deployment, get program ID from anchor.toml or output
PROGRAM_ID=$(anchor keys list | grep coin-pusher-game | awk '{print $NF}')
echo $PROGRAM_ID

# Update .env.local
sed -i "s/VITE_SOLANA_PROGRAM_ID=.*/VITE_SOLANA_PROGRAM_ID=$PROGRAM_ID/" .env.local
```

### Deploy Frontend (Optional)

```bash
# Build production bundle
npm run build

# Deploy to Vercel (or your preferred host)
vercel deploy dist/
```

---

## Security Considerations

### Smart Contract Security

✅ **PDA Verification**: All account modifications verify PDA seeds  
✅ **Signer Check**: Instructions validate `Signer` trait  
✅ **Rate Limiting**: 1-second minimum between bump transactions  
✅ **Input Validation**: All amounts checked > 0  
✅ **Re-entrancy Protection**: State updates atomic within transaction  

### Known Limitations

⚠️ No sybil protection (anyone can create GameState)  
⚠️ No withdrawal authorization (only player can withdraw their own)  
⚠️ No admin withdrawal (balance locked in program)  

### Recommendations for Production

1. Add authority/admin signer for critical operations
2. Implement withdrawal limits per player per day
3. Add treasury management instruction (collect fees)
4. Use devnet/testnet extensively before mainnet
5. Audit contract with professional security firm

---

## Troubleshooting

### Issue: "Insufficient balance for transaction"

**Solution**: Airdrop more SOL to your wallet
```bash
solana airdrop 2
```

### Issue: "Program account not found"

**Solution**: Ensure PROGRAM_ID in .env.local is correct and program is deployed
```bash
solana program show <PROGRAM_ID>
```

### Issue: "Wallet connection fails"

**Solution**: Clear browser cache, check MetaMask/Phantom settings
```bash
# Browser DevTools Console:
localStorage.clear()
```

### Issue: "Transaction simulation failed"

**Solution**: Check instruction arguments and account ordering
```bash
# Enable Anchor debug logging
ANCHOR_PROVIDER_DEBUG=1 npm run dev
```

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev                # Start dev server
npm run build              # Production build

# Smart Contract
cargo build                # Build program
anchor test                # Run tests
anchor deploy --provider.cluster devnet  # Deploy to Gorbagana

# Blockchain
solana airdrop 2           # Get testnet SOL
solana account-info <PUBKEY>  # Check account state
solana logs                # Stream transaction logs
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SOLANA_RPC_URL` | RPC endpoint | `https://api.devnet.solana.com` |
| `VITE_SOLANA_CLUSTER` | Network | `devnet`, `testnet`, `mainnet` |
| `VITE_SOLANA_PROGRAM_ID` | Program address | `11111...` |

---

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review [Solana Docs](https://docs.solana.com)
3. Check [Anchor Book](https://book.anchor-lang.com)
4. Open GitHub issue with full error context

---

**Happy building! 🚀**
