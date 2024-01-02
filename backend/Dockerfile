FROM node:21.5-alpine

ENV DATABASE_URL=file:./dev.db

WORKDIR /app

RUN apk update && apk add python3 make g++

COPY . ./
COPY package*.json ./

RUN npm install
RUN npx prisma migrate deploy
RUN npx prisma generate
RUN npx prisma db seed

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
