# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/pro-cp/package.json ./apps/pro-cp/

RUN pnpm install --frozen-lockfile

COPY apps/pro-cp ./apps/pro-cp

RUN pnpm build --filter=@truzon/pro-cp

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/pro-cp/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/pro-cp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/pro-cp/.next/static ./.next/static

USER nextjs

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]