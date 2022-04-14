FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npm.taobao.org
RUN npm i

COPY . .

RUN npm run build


FROM node:alpine AS prod

WORKDIR /app

COPY --from=builder /app ./

CMD ["node", "dist/main"]