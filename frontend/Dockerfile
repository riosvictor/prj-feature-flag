FROM node:21.5-alpine

ENV PORT=3001
ENV NEXT_PUBLIC_URL_BACKEND=http://localhost:3000

WORKDIR /app

RUN apk update && apk add python3 make g++

COPY . ./
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
