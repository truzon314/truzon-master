# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/public-web/package.json ./apps/public-web/

RUN pnpm install --frozen-lockfile

COPY apps/public-web ./apps/public-web

RUN pnpm build --filter=@truzon/public-web

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/public-web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/public-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/public-web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]