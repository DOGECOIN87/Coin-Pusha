#!/bin/bash

# ============================================================================
# Coin Pusher Game - Program Build Script
# Compiles Anchor program for local testing
# ============================================================================

set -e

echo "============================================================================"
echo "Coin Pusher Game - Building Anchor Program"
echo "============================================================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo not found. Install Rust from: https://rustup.rs/"
    exit 1
fi

if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Install with: npm install -g @coral-xyz/anchor-cli"
    exit 1
fi

echo "✅ Prerequisites found"
echo ""

# Build program
echo "🔨 Building program..."
cd programs/coin-pusher-game

echo "   Running cargo build..."
cargo build

echo "   Running cargo build --release..."
cargo build --release

echo "✅ Build successful!"
echo ""

# Verify build artifacts
ARTIFACT_DEBUG="target/debug/coin_pusher_game.so"
ARTIFACT_RELEASE="target/release/coin_pusher_game.so"

if [ -f "$ARTIFACT_RELEASE" ]; then
    SIZE=$(du -h "$ARTIFACT_RELEASE" | cut -f1)
    echo "📦 Build artifacts:"
    echo "   Release: $ARTIFACT_RELEASE ($SIZE)"
fi

if [ -f "$ARTIFACT_DEBUG" ]; then
    SIZE=$(du -h "$ARTIFACT_DEBUG" | cut -f1)
    echo "   Debug: $ARTIFACT_DEBUG ($SIZE)"
fi

echo ""
echo "============================================================================"
echo "✨ BUILD COMPLETE!"
echo "============================================================================"
echo ""
echo "Next steps:"
echo "   1. Run tests: cargo test --lib"
echo "   2. Deploy: bash ../../../scripts/deploy-program.sh"
echo ""
