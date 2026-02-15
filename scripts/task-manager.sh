#!/bin/bash
# Task Management Utility for Manus System

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TODO_FILE="$PROJECT_ROOT/todo.md"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
  cat << EOF
Manus Task Management Utility

Usage: ./task-manager.sh [COMMAND] [OPTIONS]

Commands:
  list              List all tasks from todo.md
  add TEXT          Add a new task
  complete NUM      Mark task as completed
  in-progress NUM   Mark task as in-progress
  not-started NUM   Mark task as not-started
  show NUM          Show detailed info for task
  stats             Show task statistics
  help              Show this help message

Examples:
  ./task-manager.sh list
  ./task-manager.sh add "Configure environment variables"
  ./task-manager.sh complete 1
  ./task-manager.sh in-progress 2
  ./task-manager.sh stats
EOF
}

create_todo() {
  if [ ! -f "$TODO_FILE" ]; then
    cat > "$TODO_FILE" << EOF
# Manus System Todo List

## Active Tasks

## Completed Tasks

---
Last Updated: $(date)
EOF
    echo -e "${GREEN}✓ Created todo.md${NC}"
  fi
}

list_tasks() {
  if [ ! -f "$TODO_FILE" ]; then
    echo -e "${YELLOW}No todo.md found${NC}"
    return
  fi

  echo -e "${BLUE}=== Task List ===${NC}"
  cat "$TODO_FILE"
}

add_task() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: No task text provided${NC}"
    return 1
  fi

  create_todo

  # Get the next task number
  NEXT_NUM=$(grep -c "^- " "$TODO_FILE" 2>/dev/null || echo "0")
  NEXT_NUM=$((NEXT_NUM + 1))

  # Append to Active Tasks section
  sed -i "/^## Active Tasks/a - [ ] #$NEXT_NUM $1" "$TODO_FILE"
  
  echo -e "${GREEN}✓ Task added: #$NEXT_NUM $1${NC}"
}

mark_complete() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: No task number provided${NC}"
    return 1
  fi

  local TASK_NUM=$1
  sed -i "s/- \[ \] #$TASK_NUM/- [x] #$TASK_NUM/" "$TODO_FILE"
  echo -e "${GREEN}✓ Task #$TASK_NUM marked as completed${NC}"
}

mark_inprogress() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: No task number provided${NC}"
    return 1
  fi

  local TASK_NUM=$1
  sed -i "s/- \[\([ x]\)\] #$TASK_NUM/- [-] #$TASK_NUM/" "$TODO_FILE"
  echo -e "${GREEN}✓ Task #$TASK_NUM marked as in-progress${NC}"
}

show_stats() {
  if [ ! -f "$TODO_FILE" ]; then
    echo -e "${YELLOW}No todo.md found${NC}"
    return
  fi

  TOTAL=$(grep -c "^- " "$TODO_FILE" 2>/dev/null || echo "0")
  COMPLETED=$(grep -c "^\- \[x\]" "$TODO_FILE" 2>/dev/null || echo "0")
  INPROGRESS=$(grep -c "^\- \[-\]" "$TODO_FILE" 2>/dev/null || echo "0")
  PENDING=$((TOTAL - COMPLETED - INPROGRESS))

  echo -e "${BLUE}=== Task Statistics ===${NC}"
  echo "Total Tasks: $TOTAL"
  echo -e "Completed: ${GREEN}$COMPLETED${NC}"
  echo -e "In Progress: ${YELLOW}$INPROGRESS${NC}"
  echo -e "Pending: ${RED}$PENDING${NC}"
  if [ "$TOTAL" -gt 0 ]; then
    PERCENT=$((COMPLETED * 100 / TOTAL))
    echo "Completion: $PERCENT%"
  fi
}

# Main command handler
case "${1:-help}" in
  list)
    list_tasks
    ;;
  add)
    add_task "$2"
    ;;
  complete)
    mark_complete "$2"
    ;;
  in-progress)
    mark_inprogress "$2"
    ;;
  not-started)
    mark_inprogress "$2" && sed -i "s/- \[-\] #$2/- [ ] #$2/" "$TODO_FILE"
    ;;
  show)
    grep "^- .*#$2" "$TODO_FILE"
    ;;
  stats)
    show_stats
    ;;
  help)
    usage
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    usage
    exit 1
    ;;
esac
