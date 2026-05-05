#!/bin/bash
# Start the API Backend on port 4000 in the background
echo "Starting API on port 4000..."
export PORT=4000
pnpm --filter @campusos/api start &

# Wait for a few seconds to let API start
sleep 5

# Start the Frontend on the Render-provided port (usually 10000)
echo "Starting Frontend on port $PORT..."
pnpm --filter @campusos/web start
