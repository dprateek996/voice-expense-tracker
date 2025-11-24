#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Copy .env.example -> .env if not present
if [ ! -f .env ]; then
  echo "Creating .env from .env.example"
  cp .env.example .env
fi

# Start postgres via docker compose
if ! docker ps --format '{{.Names}}' | grep -q voice-expense-db; then
  echo "Starting Postgres via docker-compose..."
  docker compose up -d
else
  echo "Postgres container already running"
fi

# wait for DB to be healthy
echo "Waiting for Postgres to be ready (pg_isready)..."
for i in {1..30}; do
  if docker exec voice-expense-db pg_isready -U postgres >/dev/null 2>&1; then
    echo "Postgres is ready"
    break
  fi
  sleep 2
done

# Install node deps, generate prisma client and push schema
npm install
npx prisma generate
npx prisma db push

# Start server with nodemon if available
if command -v nodemon >/dev/null 2>&1; then
  echo "Starting server with nodemon"
  npx nodemon server.js
else
  echo "Starting server with node"
  node server.js
fi
