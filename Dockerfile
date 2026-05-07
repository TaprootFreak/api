# Multi-stage build for the lds-api NestJS service.
#
# Built and pushed by .github/workflows/lds-api-{dev,prd}.yaml as
# lightningdotspacecom/lds-api:{beta,latest} (linux/arm64).
#
# Mirrors the layout of the existing lnbitsapi Dockerfile.

FROM node:18.19.1-alpine3.19 AS builder

USER node
WORKDIR /home/node

ADD --chown=node:node package.json .
ADD --chown=node:node package-lock.json .
RUN npm ci

ADD --chown=node:node . .
RUN npm run build


FROM node:18.19.1-alpine3.19

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package.json /home/node/package-lock.json ./
COPY --from=builder /home/node/dist ./dist
COPY --from=builder /home/node/migration ./migration

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/main.js"]
