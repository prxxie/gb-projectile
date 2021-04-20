FROM node:14-alpine

LABEL maintainer="chungpt"

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]