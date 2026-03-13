#!/bin/bash
set -euo pipefail

pkill -f "python3 -m http.server 4173 --bind 127.0.0.1 -d dist" >/dev/null 2>&1 || true
pkill -f "node server/tencent-ocr-server.mjs" >/dev/null 2>&1 || true

echo "Class table services stopped."
