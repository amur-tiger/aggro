FROM node:16-alpine AS base

WORKDIR /app
COPY . .

RUN apk --no-cache add curl
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node
RUN pnpm config set store-dir /app/.pnpm-store



FROM base AS build

RUN pnpm --unsafe-perm install
RUN pnpm build



FROM base AS dependencies

RUN pnpm --unsafe-perm --ignore-scripts --prod --filter @aggro/server... install



FROM gcr.io/distroless/nodejs:16 AS prod

WORKDIR /app

COPY --from=dependencies /app/node_modules/ ./node_modules/
COPY --from=dependencies /app/packages/server/node_modules/ ./packages/server/node_modules/
COPY --from=build /app/packages/frontend/public/ ./packages/frontend/public/
COPY --from=build /app/packages/server/build/ ./packages/server/build/

CMD ["/app/packages/server/build/main.js"]
