FROM node:17.1.0-alpine3.12 AS development
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development
EXPOSE 3000
CMD [ "npm", "run", "dev" ]

FROM node:18.20-alpine AS dependencies
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18.20-alpine AS builder
ENV NODE_ENV=development
WORKDIR /app
COPY . .
RUN npm ci && NODE_ENV=production npm run build

FROM node:18.20-alpine AS production
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production
COPY --chown=node --from=builder /app/next.config.mjs ./
COPY --chown=node --from=builder /app/public ./public
COPY --chown=node --from=builder /app/.next ./.next
COPY --chown=node --from=builder /app/package-lock.json /app/package.json ./
COPY --chown=node --from=dependencies /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD [ "npm", "start" ]