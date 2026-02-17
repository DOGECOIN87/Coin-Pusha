# Coin Pusher Game - Deployment Checklist

## ✅ Completed Fixes

### 1. Token Configuration
- [x] Created `tokenConfig.ts` with correct token addresses
  - JUNK Token: `BgvprjyRDq1erzQocRTmLPBzMuEmcARg64LE9eGX9XRF`
  - TRASHCOIN Token: `GNFqCqaU9R2jas4iaKEFZM5hiX5AHxBL7rPHTCpX5T6z`
- [x] Created `tokenService.ts` for SPL token operations
- [x] Added `@solana/spl-token` dependency to package.json

### 2. Bump Bug Fix
- [x] Fixed bump cost from 25 to 50 JUNK in `GameEngine.ts`
- [x] Fixed bump cost display in `Overlay.tsx` (paytable)
- [x] Added proper transaction state checking to prevent multiple clicks
- [x] Added console logging for debugging transaction flow

### 3. High Score Board
- [x] Created `highScoreService.ts` to query blockchain for leaderboard
- [x] Created `HighScoreBoard.tsx` component with Gorbagana branding
- [x] Added "Scores" button to game UI
- [x] Implemented player rank display
- [x] Added tabs for "Top Scores" and "Top Profits"
- [x] Styled with Gorbagana brand colors (neon green, cyan accents)

### 4. Crash Protection
- [x] Created `statePersistence.ts` service
- [x] Implemented auto-save every 5 seconds to localStorage
- [x] Added recovery prompt on page load
- [x] Added beforeunload handler to save final state
- [x] Wallet-specific state recovery (only restore for same wallet)
- [x] 24-hour expiration for saved states

### 5. Gorbagana Branding
- [x] High score board uses Pusia Bold font for headings
- [x] Neon green (#00FF00) primary color
- [x] Cyan (#00FFFF) accents for secondary actions
- [x] Glow effects on interactive elements
- [x] Dark green backgrounds (#0d3d24, #1a5f3f)

## 🔧 Pre-Deployment Steps

### 1. Build Anchor Program
```bash
cd coin-pusher-src
anchor build
```

### 2. Deploy Program to Gorbagana
```bash
# Set Gorbagana cluster
anchor deploy --provider.cluster gorbagana

# Note the deployed program ID
```

### 3. Update Configuration
- [ ] Update `.env` with deployed program ID
- [ ] Update `Anchor.toml` with deployed program ID
- [ ] Verify RPC URL points to Gorbagana: `https://rpc.trashscan.io`

### 4. Initialize Game Program
```bash
# Run initialization script (if needed)
anchor run initialize
```

### 5. Build Frontend
```bash
cd coin-pusher-src
npm install
npm run build
```

### 6. Deploy Frontend
- [ ] Upload `dist/` folder to hosting (Vercel, Netlify, or IPFS)
- [ ] Configure domain (if applicable)
- [ ] Test on Gorbagana testnet first

## 🧪 Testing Checklist

### Wallet Connection
- [ ] Connect wallet successfully
- [ ] Display correct wallet address
- [ ] Show JUNK token balance
- [ ] Show TRASHCOIN balance (if any)

### Game Mechanics
- [ ] Drop coin costs 1 JUNK
- [ ] Balance decrements correctly
- [ ] Coins fall and interact with physics
- [ ] Collecting coins increases balance
- [ ] Net profit calculation is accurate

### Bump Functionality
- [ ] Bump costs 50 JUNK
- [ ] Cannot bump multiple times during transaction
- [ ] Transaction states display correctly (signing, broadcasting, confirmed)
- [ ] Bump applies physics impulse to coins
- [ ] Balance updates after bump

### High Score Board
- [ ] Opens when "Scores" button clicked
- [ ] Fetches data from blockchain
- [ ] Displays top 100 scores
- [ ] Shows player's rank (if connected)
- [ ] Refresh button works
- [ ] Tabs switch between Score and Profit leaderboards

### Crash Protection
- [ ] Auto-save runs every 5 seconds
- [ ] Recovery prompt appears after page reload
- [ ] Restored state matches saved state
- [ ] Different wallets have separate saved states
- [ ] Old saves (>24h) are ignored

### Token Integration
- [ ] JUNK token is used for all betting
- [ ] TRASHCOIN appears rarely (6% spawn chance)
- [ ] TRASHCOIN worth 5x normal coins
- [ ] Cannot bet with TRASHCOIN

## 🚀 Deployment Commands

### Deploy Program
```bash
cd coin-pusher-src
anchor build
anchor deploy --provider.cluster gorbagana
```

### Update Program ID
```bash
# After deployment, update these files:
# - Anchor.toml
# - .env (VITE_SOLANA_PROGRAM_ID)
```

### Build and Deploy Frontend
```bash
npm install
npm run build

# Deploy to hosting provider
# Example for Vercel:
vercel --prod
```

## 📋 Post-Deployment Verification

- [ ] Game loads without errors
- [ ] Wallet connects to Gorbagana network
- [ ] Token balances display correctly
- [ ] All game mechanics work as expected
- [ ] High score board queries blockchain successfully
- [ ] Transactions are confirmed on-chain
- [ ] State persistence works across page reloads

## 🔐 Security Checks

- [ ] No private keys in code
- [ ] Environment variables properly configured
- [ ] RPC endpoint is secure (HTTPS)
- [ ] Transaction signing requires user approval
- [ ] No unauthorized token transfers possible

## 📝 Known Issues / Future Improvements

- Game engine needs method to restore balance/score from saved state
- Consider adding transaction history view
- Add sound effects for better UX
- Implement leaderboard pagination for >100 entries
- Add social sharing for high scores

## 🎯 Ready for Deployment

Once all checkboxes are complete and testing passes, the game is ready for production deployment on Gorbagana blockchain.

**Deployment Date**: _________________

**Deployed Program ID**: _________________

**Frontend URL**: _________________
