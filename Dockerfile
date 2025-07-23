FROM node:23-alpine

WORKDIR /site

COPY package*.json ./

RUN npm ci

COPY . .

RUN --mount=type=secret,id=.env env $(cat /run/secrets/.env | xargs) npx convex deploy --cmd 'npm run build'
