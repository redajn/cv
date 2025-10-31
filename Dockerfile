FROM node:22-alpine AS builder

WORKDIR /app
RUN apk update && apk upgrade --no-cache

COPY package.json package-lock.json ./

RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:alpine

RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY error.html /usr/share/nginx/html/error.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
