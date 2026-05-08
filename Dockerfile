# Multi-stage build for the lds-api NestJS service.
#
# Built and pushed by .github/workflows/lds-api-{dev,prd}.yaml as
# lightningdotspacecom/lds-api:{beta,latest} (linux/arm64).
#
# Mirrors the layout of the existing lnbitsapi Dockerfile.

FROM node:18.19.1-alpine3.19 AS builder

# node-gyp needs Python + a C/C++ toolchain to build native modules
# (e.g. solana/eth signing crates). Alpine ships none of those by default.
RUN apk add --no-cache python3 make g++

USER node
WORKDIR /home/node

ADD --chown=node:node package.json .
ADD --chown=node:node package-lock.json .
RUN npm ci

ADD --chown=node:node . .
RUN npm run build
# Drop dev deps in-place after the build so the runtime stage can copy
# the already-compiled native modules instead of re-running node-gyp
# (which would need python3 + g++ in the runtime image again).
RUN npm prune --omit=dev


FROM node:18.19.1-alpine3.19

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package.json /home/node/package-lock.json ./
COPY --from=builder /home/node/node_modules ./node_modules
COPY --from=builder /home/node/dist ./dist
COPY --from=builder /home/node/migration ./migration

EXPOSE 3000

CMD ["node", "dist/main.js"]
