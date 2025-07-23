FROM node:23-alpine

WORKDIR /site

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx convex deploy --cmd 'npm run build'
