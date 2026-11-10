# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

RUN apk add --no-cache jq

LABEL org.opencontainers.image.title="system-preview" \
      org.opencontainers.image.description="Preview page with launch countdown, served by nginx"

ENV SYSTEM_NAME="Aurora" \
    SYSTEM_DESCRIPTION="Uma nova experiência para gerenciar, acompanhar e evoluir suas operações — em um só lugar." \
    SYSTEM_START_DATE="2026-12-20T09:00:00-03:00" \
    SYSTEM_URL="" \
    SYSTEM_BACKGROUND_DIRS="/backgrounds"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/40-generate-config.sh /docker-entrypoint.d/40-generate-config.sh
COPY docker/50-generate-backgrounds.sh /docker-entrypoint.d/50-generate-backgrounds.sh
RUN chmod +x /docker-entrypoint.d/40-generate-config.sh /docker-entrypoint.d/50-generate-backgrounds.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
