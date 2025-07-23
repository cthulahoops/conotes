FROM node:23-alpine

WORKDIR /site

COPY package*.json ./

RUN npm ci

COPY . .

RUN --mount=type=secret,id=CONVEX_DEPLOY_KEY npx convex deploy --cmd 'npm run build'
