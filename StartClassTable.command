#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
RUNTIME_DIR="$PROJECT_DIR/.runtime"
mkdir -p "$RUNTIME_DIR"

start_if_needed() {
  local pid_file="$1"
  local log_file="$2"
  shift 2

  if [[ -f "$pid_file" ]]; then
    local existing_pid
    existing_pid="$(cat "$pid_file" 2>/dev/null || true)"
    if [[ -n "$existing_pid" ]] && kill -0 "$existing_pid" 2>/dev/null; then
      return 0
    fi
  fi

  nohup "$@" >"$log_file" 2>&1 &
  echo $! >"$pid_file"
}

cd "$PROJECT_DIR"

start_if_needed "$RUNTIME_DIR/ocr_proxy.pid" "$RUNTIME_DIR/ocr_proxy.log" node server/tencent-ocr-server.mjs
start_if_needed "$RUNTIME_DIR/web.pid" "$RUNTIME_DIR/web.log" node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173

sleep 2
open "http://127.0.0.1:5173" || true

echo "Class table is running."
echo "Logs: $RUNTIME_DIR/ocr_proxy.log and $RUNTIME_DIR/web.log"
