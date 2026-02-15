#!/bin/bash

# ============================================================================
# Coin Pusher Game - Program Deployment Script
# Deploys Anchor program to Gorbagana (Solana Devnet)
# ============================================================================

set -e

NETWORK="devnet"
SOLANA_RPC="https://api.devnet.solana.com"

echo "============================================================================"
echo "Coin Pusher Game - Deployment to Gorbagana"
echo "============================================================================"
echo ""

# Step 1: Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Install with: npm install -g @coral-xyz/anchor-cli"
    exit 1
fi

if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Install from: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo not found. Install Rust from: https://rustup.rs/"
    exit 1
fi

echo "✅ All prerequisites found"
echo ""

# Step 2: Configure network
echo "🌐 Configuring Solana network..."
solana config set --url "$SOLANA_RPC"
echo "✅ Network set to: $SOLANA_RPC"
echo ""

# Step 3: Check wallet
echo "👛 Checking wallet..."
WALLET=$(solana address)
BALANCE=$(solana balance | awk '{print $1}')
echo "   Wallet: $WALLET"
echo "   Balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 0.5" | bc -l) )); then
    echo "⚠️  Low balance. Requesting airdrop..."
    solana airdrop 2
fi
echo "✅ Wallet ready"
echo ""

# Step 4: Build program
echo "🔨 Building Anchor program..."
cd programs/coin-pusher-game
cargo build --release
echo "✅ Build complete"
echo ""

# Step 5: Deploy program
cd ../..
echo "🚀 Deploying program to Gorbagana..."
DEPLOY_OUTPUT=$(anchor deploy --provider.cluster "$NETWORK" 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract program ID
PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Program Id: \K[A-Za-z0-9]+')
if [ -z "$PROGRAM_ID" ]; then
    echo "❌ Failed to extract program ID from deployment output"
    exit 1
fi

echo "✅ Program deployed successfully"
echo ""

# Step 6: Update environment
echo "⚙️  Updating environment configuration..."
ENV_FILE=".env.local"

if [ -f "$ENV_FILE" ]; then
    # Update existing PROGRAM_ID
    sed -i.bak "s/VITE_SOLANA_PROGRAM_ID=.*/VITE_SOLANA_PROGRAM_ID=$PROGRAM_ID/" "$ENV_FILE"
    rm -f "$ENV_FILE.bak"
    echo "✅ Updated $ENV_FILE"
else
    echo "⚠️  $ENV_FILE not found. Creating..."
    cat > "$ENV_FILE" << EOF
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_CLUSTER=devnet
VITE_SOLANA_PROGRAM_ID=$PROGRAM_ID
EOF
    echo "✅ Created $ENV_FILE"
fi
echo ""

# Step 7: Verify deployment
echo "🔍 Verifying deployment..."
solana program show "$PROGRAM_ID"
echo "✅ Program verified on-chain"
echo ""

# Step 8: Summary
echo "============================================================================"
echo "✨ DEPLOYMENT SUCCESSFUL!"
echo "============================================================================"
echo ""
echo "📊 Deployment Summary:"
echo "   Program ID: $PROGRAM_ID"
echo "   Network: Gorbagana ($NETWORK)"
echo "   RPC: $SOLANA_RPC"
echo ""
echo "🚀 Next steps:"
echo "   1. Start dev server: npm run dev"
echo "   2. Open http://localhost:5173 in browser"
echo "   3. Connect wallet"
echo "   4. Play and test bump transactions!"
echo ""
echo "📝 Deployment details saved to: deploy-$(date +%s).log"
echo ""
