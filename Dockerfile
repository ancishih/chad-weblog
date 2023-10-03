
FROM --platform=linux/amd64 node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --link ecosystem.config.js next.config.js package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps --link /app/node_modules ./node_modules
COPY --link . .
# This will do the trick, use the corresponding env file for each environment.
RUN npm install -g npm@10.1.0
RUN npm run build
# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
RUN npm install --global pm2
ENV NODE_ENV=production


RUN \
  addgroup -g 1001 -S nodejs; \
  adduser -S nextjs -u 1001

COPY --from=builder --link /app/public ./public

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --link --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --link --chown=1001:1001 /app/.next/static ./.next/static
COPY --from=builder --link --chown=1001:1001 /app/ecosystem.config.js ./

# USER nextjs
ENV NEXT_TELEMETRY_DISABLED=1

# RUN ["chmod", "+x", "/app/entrypoint.sh"]

CMD ["pm2-runtime", "ecosystem.config.js"]