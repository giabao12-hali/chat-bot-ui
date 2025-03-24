# Stage 1: Build

# FROM node:20.18.0-alpine AS builder
FROM node:20.18.0-bullseye AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./ ./tsconfig.json ./

RUN npm install --frozen-lockfile --legacy-peer-deps

COPY . .

RUN npm run build

RUN rm -rf /root/.npm /tmp/* .next/cache && \
    npm prune --omit=dev --legacy-peer-deps

# Stage 2: Run
FROM node:20.18.0-bullseye

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/package*.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]