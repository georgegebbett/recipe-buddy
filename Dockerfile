FROM node:18-alpine AS base

# mostly inspired from https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile & https://github.com/remix-run/example-trellix/blob/main/Dockerfile

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
# set the store dir to a folder that is not in the project
RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm fetch

FROM base AS deps
USER node
# WORKDIR now sets correct permissions if you set USER first so `USER node` has permissions on `/app` directory
WORKDIR /home/node/app
COPY --chown=node:node package.json pnpm-lock.yaml* ./

USER root

RUN pnpm install

FROM base as production-deps
WORKDIR /home/node/app

COPY --from=deps --chown=node:node /home/node/app/node_modules ./node_modules
COPY --chown=node:node package.json pnpm-lock.yaml* ./
RUN pnpm prune --prod

FROM base AS builder

WORKDIR /home/node/app
COPY --from=deps --chown=node:node /home/node/app/node_modules ./node_modules
COPY --chown=node:node src/server/db/drizzle ./migrations
COPY --chown=node:node . .

#RUN pnpm install --offline

ENV SKIP_ENV_VALIDATION=1

RUN pnpm build

FROM base AS runner
WORKDIR /home/node/app

RUN apk add --no-cache dumb-init

ENV NODE_ENV production
ENV DATABASE_URL="/home/node/app/data/sqlite.db"

RUN mkdir data

VOLUME "/home/node/app/data"

COPY --from=builder /home/node/app/next.config.js ./
COPY --from=builder /home/node/app/public ./public
COPY --from=builder /home/node/app/package.json ./package.json
COPY --from=production-deps --chown=node:node home/node/app/node_modules ./node_modules


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# Some things are not allowed (see https://github.com/vercel/next.js/issues/38119#issuecomment-1172099259)
COPY --from=builder --chown=node:node /home/node/app/.next/standalone ./
COPY --from=builder --chown=node:node /home/node/app/.next/static ./.next/static
COPY --from=builder --chown=node:node /home/node/app/src/server/db ./db

COPY --from=builder --chown=node:node /home/node/app/migrations ./migrations

# Move the run script and litestream config to the runtime image
COPY --chown=node:node src/server/db/ ./migrations
COPY --chown=node:node scripts/run.sh ./run.sh

RUN npx tsc -b ./migrations

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0
ENV NEXTAUTH_URL_INTERNAL http://0.0.0.0:3000

RUN chmod +x ./run.sh

CMD ["dumb-init", "--", "./run.sh"]
