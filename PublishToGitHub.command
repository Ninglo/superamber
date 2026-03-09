#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_NAME="newestclasstable"

cd "$PROJECT_DIR"

if [[ ! -d ".git" ]]; then
  git init -b main
fi

git add .

if ! git diff --cached --quiet; then
  git commit -m "Initial publish"
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub login is required before publishing."
  echo "Run: gh auth login -h github.com"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  git push -u origin main
fi
