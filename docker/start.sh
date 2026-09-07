#!/bin/sh

# Wait for database
echo "Waiting for database..."
while ! nc -z postgres 5432; do
  sleep 1
done

# Wait for Redis
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 1
done

# Run database migrations
echo "Running database migrations..."
cd /app/apps/api && npx prisma migrate deploy

# Start all services
echo "Starting services..."
cd /app/apps/api && node dist/main.js &
API_PID=$!

cd /app/apps/public-web && PORT=3000 node server.js &
WEB_PID=$!

cd /app/apps/admin && PORT=3001 node server.js &
ADMIN_PID=$!

cd /app/apps/pro-cp && PORT=3002 node server.js &
PRO_CP_PID=$!

# Handle shutdown
trap "kill $API_PID $WEB_PID $ADMIN_PID $PRO_CP_PID; exit 0" SIGTERM SIGINT

# Wait for all processes
wait $API_PID $WEB_PID $ADMIN_PID $PRO_CP_PID