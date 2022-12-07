FROM node:16-alpine AS builder

WORKDIR /root/

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build


FROM node:16-alpine

WORKDIR /root/

COPY --from=builder /root/node_modules /root/node_modules
COPY --from=builder /root/dist /root/dist

EXPOSE 4000

CMD ["node", "dist/main"]
