#!/bin/bash
# Service Management Utility for Manus System

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANUS_HOME="$PROJECT_ROOT/.manus"
RUNTIME_DIR="$MANUS_HOME/runtime"
LOGS_DIR="$MANUS_HOME/logs"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

mkdir -p "$RUNTIME_DIR" "$LOGS_DIR"

# Service PID tracking
get_service_pid() {
  local SERVICE_NAME=$1
  local PID_FILE="$RUNTIME_DIR/${SERVICE_NAME}.pid"
  
  if [ -f "$PID_FILE" ]; then
    cat "$PID_FILE"
  else
    echo ""
  fi
}

start_service() {
  local SERVICE_NAME=$1
  local COMMAND=$2
  
  if [ -z "$SERVICE_NAME" ] || [ -z "$COMMAND" ]; then
    echo -e "${RED}Usage: start_service <name> <command>${NC}"
    return 1
  fi
  
  local PID=$(get_service_pid "$SERVICE_NAME")
  
  if [ ! -z "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    echo -e "${YELLOW}Service $SERVICE_NAME is already running (PID: $PID)${NC}"
    return 0
  fi
  
  echo -e "${YELLOW}Starting $SERVICE_NAME...${NC}"
  local LOG_FILE="$LOGS_DIR/${SERVICE_NAME}.log"
  nohup bash -c "$COMMAND" > "$LOG_FILE" 2>&1 &
  local NEW_PID=$!
  
  echo "$NEW_PID" > "$RUNTIME_DIR/${SERVICE_NAME}.pid"
  echo -e "${GREEN}✓ $SERVICE_NAME started (PID: $NEW_PID)${NC}"
  echo "  Log: $LOG_FILE"
}

stop_service() {
  local SERVICE_NAME=$1
  
  if [ -z "$SERVICE_NAME" ]; then
    echo -e "${RED}Usage: stop_service <name>${NC}"
    return 1
  fi
  
  local PID=$(get_service_pid "$SERVICE_NAME")
  
  if [ -z "$PID" ] || ! kill -0 "$PID" 2>/dev/null; then
    echo -e "${YELLOW}Service $SERVICE_NAME is not running${NC}"
    return 0
  fi
  
  echo -e "${YELLOW}Stopping $SERVICE_NAME (PID: $PID)...${NC}"
  kill "$PID"
  sleep 1
  
  if kill -0 "$PID" 2>/dev/null; then
    echo -e "${YELLOW}Force killing $SERVICE_NAME...${NC}"
    kill -9 "$PID"
  fi
  
  rm -f "$RUNTIME_DIR/${SERVICE_NAME}.pid"
  echo -e "${GREEN}✓ $SERVICE_NAME stopped${NC}"
}

status_service() {
  local SERVICE_NAME=$1
  local PID=$(get_service_pid "$SERVICE_NAME")
  
  if [ ! -z "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    echo -e "${GREEN}✓ $SERVICE_NAME is running (PID: $PID)${NC}"
    return 0
  else
    echo -e "${RED}✗ $SERVICE_NAME is not running${NC}"
    return 1
  fi
}

list_services() {
  echo -e "${BLUE}=== Active Services ===${NC}"
  for pid_file in "$RUNTIME_DIR"/*.pid; do
    if [ -f "$pid_file" ]; then
      SERVICE_NAME=$(basename "$pid_file" .pid)
      PID=$(cat "$pid_file")
      if kill -0 "$PID" 2>/dev/null; then
        echo -e "${GREEN}✓ $SERVICE_NAME (PID: $PID)${NC}"
      else
        echo -e "${RED}✗ $SERVICE_NAME (PID: $PID, dead)${NC}"
      fi
    fi
  done
}

show_help() {
  cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════════╗
║             Manus Service Manager - Service Lifecycle Control            ║
╚═══════════════════════════════════════════════════════════════════════════╝

USAGE:
  service-manager.sh COMMAND [SERVICE-NAME] [OPTIONS]

COMMANDS:
  start NAME "COMMAND"    Start a new service with given command
  stop NAME               Stop a running service
  status NAME             Check status of a service
  list                    List all active services
  restart NAME "CMD"      Restart a service
  logs NAME [LINES]       View service logs (default 20 lines)
  help                    Show this help message

EXAMPLES:
  # Start a web server on port 8080
  $0 start webserver "python3 -m http.server 8080"

  # Start a Node.js application
  $0 start app "node /home/user/app.js"

  # Stop a service
  $0 stop webserver

  # Check service status
  $0 status app

  # View service logs (last 50 lines)
  $0 logs webserver 50

  # List all services
  $0 list

FEATURES:
  ✓ PID-based service tracking
  ✓ Automatic log file management
  ✓ Graceful shutdown with force kill fallback
  ✓ Service status monitoring
  ✓ Log viewing and management

LOGS LOCATION:
  All service logs stored in: $LOGS_DIR/

RUNTIME FILES:
  Service PIDs tracked in: $RUNTIME_DIR/

═══════════════════════════════════════════════════════════════════════════
EOF
}

restart_service() {
  local SERVICE_NAME=$1
  local COMMAND=$2
  
  if [ -z "$SERVICE_NAME" ] || [ -z "$COMMAND" ]; then
    echo -e "${RED}Usage: restart_service <name> <command>${NC}"
    return 1
  fi
  
  stop_service "$SERVICE_NAME"
  sleep 1
  start_service "$SERVICE_NAME" "$COMMAND"
}

view_logs() {
  local SERVICE_NAME=$1
  local LINES=${2:-20}
  local LOG_FILE="$LOGS_DIR/${SERVICE_NAME}.log"
  
  if [ ! -f "$LOG_FILE" ]; then
    echo -e "${RED}✗ No log file found for service: $SERVICE_NAME${NC}"
    return 1
  fi
  
  echo -e "${BLUE}=== Viewing last $LINES lines of $SERVICE_NAME ===${NC}"
  tail -n "$LINES" "$LOG_FILE"
}

# Main command handler
case "${1:-help}" in
  start)
    if [ -z "$2" ] || [ -z "$3" ]; then
      echo -e "${RED}Error: start requires SERVICE_NAME and COMMAND${NC}"
      echo -e "${YELLOW}Usage: $0 start <service-name> <command>${NC}"
      exit 1
    fi
    start_service "$2" "$3"
    ;;
  stop)
    if [ -z "$2" ]; then
      echo -e "${RED}Error: stop requires SERVICE_NAME${NC}"
      echo -e "${YELLOW}Usage: $0 stop <service-name>${NC}"
      exit 1
    fi
    stop_service "$2"
    ;;
  status)
    if [ -z "$2" ]; then
      echo -e "${RED}Error: status requires SERVICE_NAME${NC}"
      echo -e "${YELLOW}Usage: $0 status <service-name>${NC}"
      exit 1
    fi
    status_service "$2"
    ;;
  list)
    list_services
    ;;
  restart)
    if [ -z "$2" ] || [ -z "$3" ]; then
      echo -e "${RED}Error: restart requires SERVICE_NAME and COMMAND${NC}"
      echo -e "${YELLOW}Usage: $0 restart <service-name> <command>${NC}"
      exit 1
    fi
    restart_service "$2" "$3"
    ;;
  logs)
    if [ -z "$2" ]; then
      echo -e "${RED}Error: logs requires SERVICE_NAME${NC}"
      echo -e "${YELLOW}Usage: $0 logs <service-name> [number-of-lines]${NC}"
      exit 1
    fi
    view_logs "$2" "$3"
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    echo -e "${YELLOW}Run '$0 help' for usage information${NC}"
    exit 1
    ;;
esac
