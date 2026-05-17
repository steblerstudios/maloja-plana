#!/bin/bash
# git-sync.sh
# Automatisiert Sync von dev → main und zurück, inkl. Tests & Build

set -e  # Stoppt bei jedem Fehler

# Funktionen
run_tests_and_build() {
  echo "🧪 Running tests..."
  npm test -- --run

  echo "🏗 Building project..."
  npm run build
}

sync_dev_to_main() {
  echo "🔄 Checking out main..."
  git checkout main

  echo "⬇ Pulling latest main..."
  git pull origin main

  echo "🔀 Merging dev into main..."
  git merge dev

  run_tests_and_build

  echo "📤 Pushing main..."
  git push origin main
}

sync_main_to_dev() {
  echo "🔄 Checking out dev..."
  git checkout dev

  echo "🔀 Merging main into dev..."
  git merge main

  run_tests_and_build

  echo "📤 Pushing dev..."
  git push origin dev
}

echo "=== Starting Git Sync ==="
sync_dev_to_main
sync_main_to_dev
echo "✅ Git Sync Complete!"
