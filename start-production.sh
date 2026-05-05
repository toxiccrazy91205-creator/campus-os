# Start the API Backend on port 4001 in the background
echo "Starting API on port 4001..."
PORT=4001 pnpm --filter @campusos/api start &

# Wait for a few seconds to let API start
sleep 5

# Start the Frontend on the Render-provided port (defaulting to 10000)
echo "Starting Frontend..."
pnpm --filter @campusos/web start
