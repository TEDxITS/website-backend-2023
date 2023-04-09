FROM node:18.15-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn prisma db pull

ENV NODE_ENV "development"

CMD yarn "$(if [ $NODE_ENV = 'production' ] ; then echo 'start' ; else echo 'dev'; fi)"
