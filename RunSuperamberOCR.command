#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

if command -v node >/dev/null 2>&1; then
  node server/tencent-ocr-server.mjs
  exit 0
fi

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$HOME/.nvm/nvm.sh"
  nvm use >/dev/null 2>&1 || true
  if command -v node >/dev/null 2>&1; then
    node server/tencent-ocr-server.mjs
    exit 0
  fi
fi

echo "Node.js 未找到，请先安装 Node 20+ 后再启动 OCR 代理。"
read -r -p "按回车键关闭..."
