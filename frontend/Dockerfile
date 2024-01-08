################################################################################
# base stage
# Base Node image
################################################################################
FROM --platform=linux/arm64/v8 public.ecr.aws/docker/library/node:20-slim as base

ENV APP_ROOT=/app

################################################################################
# deps stage
# Install all node_modules, including dev dependencies
################################################################################
FROM base as deps

WORKDIR ${APP_ROOT}

ADD package.json package-lock.json ./
RUN npm ci --include=dev

################################################################################
# production-deps stage
# Setup production node_modules
################################################################################
FROM base as production-deps

WORKDIR ${APP_ROOT}

COPY --from=deps ${APP_ROOT}/node_modules ${APP_ROOT}/node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

################################################################################
# build stage
# Build the app
################################################################################
FROM base as build

WORKDIR ${APP_ROOT}

COPY --from=deps ${APP_ROOT}/node_modules ${APP_ROOT}/node_modules

ADD . .
RUN npm run build

################################################################################
# production stage
# Finally, build the production image with minimal footprint
################################################################################
FROM base

WORKDIR ${APP_ROOT}

COPY --from=production-deps ${APP_ROOT}/node_modules ${APP_ROOT}/node_modules

COPY --from=build ${APP_ROOT}/dist ${APP_ROOT}/dist
COPY --from=build ${APP_ROOT}/public ${APP_ROOT}/public
ADD . .

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
