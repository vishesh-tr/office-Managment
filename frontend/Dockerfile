FROM node:23-slim AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

FROM build AS dev

EXPOSE 3000

CMD [ "npm", "run", "dev" ]