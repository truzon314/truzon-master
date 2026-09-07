# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY apps/public-web ./apps/public-web
COPY apps/admin ./apps/admin
COPY apps/pro-cp ./apps/pro-cp

RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd apps/api && pnpm db:generate

# Build all apps
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built applications
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/prisma ./apps/api/prisma

COPY --from=builder --chown=nodejs:nodejs /app/apps/public-web/.next/standalone ./apps/public-web/
COPY --from=builder --chown=nodejs:nodejs /app/apps/public-web/.next/static ./apps/public-web/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/apps/public-web/public ./apps/public-web/public

COPY --from=builder --chown=nodejs:nodejs /app/apps/admin/.next/standalone ./apps/admin/
COPY --from=builder --chown=nodejs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/apps/admin/public ./apps/admin/public

COPY --from=builder --chown=nodejs:nodejs /app/apps/pro-cp/.next/standalone ./apps/pro-cp/
COPY --from=builder --chown=nodejs:nodejs /app/apps/pro-cp/.next/static ./apps/pro-cp/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/apps/pro-cp/public ./apps/pro-cp/public

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Create startup script
COPY docker/start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000 3001 3002

CMD ["./start.sh"]