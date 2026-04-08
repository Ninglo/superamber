#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

if [[ ! -f "dist/index.html" ]]; then
  echo "Missing Super Amber build output. Run the frontend build before starting."
  exit 1
fi

pkill -f "python3 -m http.server 4173 --bind 127.0.0.1 -d dist" >/dev/null 2>&1 || true
pkill -f "node server/tencent-ocr-server.mjs" >/dev/null 2>&1 || true

open "$PROJECT_DIR/RunSuperamberWeb.command"
sleep 1
open "$PROJECT_DIR/RunSuperamberOCR.command"

sleep 2
open "http://127.0.0.1:4173" || true

echo "Super Amber is running."
echo "Web: http://127.0.0.1:4173"
echo "OCR: http://127.0.0.1:8787/health"
echo "Keep the two Terminal windows open while using the app."
