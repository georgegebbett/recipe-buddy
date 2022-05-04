FROM node:16-alpine as builder

COPY . .

RUN npm install

RUN npm run build

FROM nginx as Deploy

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /dist ./usr/share/nginx/html

EXPOSE 80
