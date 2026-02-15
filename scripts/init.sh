#!/bin/bash
# Manus AI System Initialization Script
# This script sets up the environment for Manus system operation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MANUS_HOME="$PROJECT_ROOT/.manus"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Manus AI System Initialization ===${NC}"

# Create necessary directories
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p "$MANUS_HOME/runtime"
mkdir -p "$MANUS_HOME/logs"
mkdir -p "$MANUS_HOME/cache"
mkdir -p "$MANUS_HOME/data"
echo -e "${GREEN}✓ Directories created${NC}"

# Export environment variables
export MANUS_HOME="$MANUS_HOME"
export MANUS_PROJECT_ROOT="$PROJECT_ROOT"
export MANUS_CONFIG="$PROJECT_ROOT/config"
export MANUS_SCRIPTS="$PROJECT_ROOT/scripts"

# Create environment file for persistence
ENV_FILE="$MANUS_HOME/manus.env"
cat > "$ENV_FILE" << EOF
# Manus AI System Environment Configuration
export MANUS_HOME="$MANUS_HOME"
export MANUS_PROJECT_ROOT="$PROJECT_ROOT"
export MANUS_CONFIG="$PROJECT_ROOT/config"
export MANUS_SCRIPTS="$PROJECT_ROOT/scripts"
export MANUS_LOG_DIR="$MANUS_HOME/logs"
export MANUS_CACHE_DIR="$MANUS_HOME/cache"
export MANUS_DATA_DIR="$MANUS_HOME/data"
EOF

echo -e "${GREEN}✓ Environment variables configured${NC}"

# Initialize logging
LOG_FILE="$MANUS_HOME/logs/initialization.log"
echo "Manus System Initialization - $(date)" > "$LOG_FILE"

# Check for required tools
echo -e "${YELLOW}Checking system dependencies...${NC}"
DEPENDENCIES=("python3" "node" "git" "curl" "wget")
MISSING_DEPS=()

for dep in "${DEPENDENCIES[@]}"; do
  if command -v "$dep" &> /dev/null; then
    echo -e "${GREEN}✓ $dep found${NC}"
  else
    echo -e "${YELLOW}⚠ $dep not found${NC}"
    MISSING_DEPS+=("$dep")
  fi
done

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
  echo -e "${YELLOW}Note: Some optional dependencies are missing: ${MISSING_DEPS[*]}${NC}"
  echo "You can install them using: sudo apt install ${MISSING_DEPS[@]}"
fi

# Initialize git repository if not already initialized
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo -e "${YELLOW}Initializing git repository...${NC}"
  cd "$PROJECT_ROOT"
  git init
  git config user.email "manus@system.local"
  git config user.name "Manus AI System"
  echo -e "${GREEN}✓ Git repository initialized${NC}"
fi

# Create initial configuration files if they don't exist
if [ ! -f "$PROJECT_ROOT/.gitignore" ]; then
  echo -e "${YELLOW}Creating .gitignore...${NC}"
  cat > "$PROJECT_ROOT/.gitignore" << EOF
# Manus system files
.manus/runtime/*
.manus/logs/*
.manus/cache/*
!.manus/runtime/.gitkeep
!.manus/logs/.gitkeep
!.manus/cache/.gitkeep

# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/
venv/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
*.log
EOF
  echo -e "${GREEN}✓ .gitignore created${NC}"
fi

# Create gitkeep files
touch "$MANUS_HOME/runtime/.gitkeep"
touch "$MANUS_HOME/logs/.gitkeep"
touch "$MANUS_HOME/cache/.gitkeep"

echo -e "${BLUE}=== Initialization Complete ===${NC}"
echo -e "${GREEN}Manus system is ready for operation${NC}"
echo -e "${YELLOW}To load environment variables in current shell, run:${NC}"
echo "source $ENV_FILE"
