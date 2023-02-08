FROM node:14.17.5 as base

WORKDIR /usr/src/app

RUN npm -v

RUN npm i -g npm@7.20.1

COPY package.json ./

RUN npm install  -g

RUN npm i -g rimraf

EXPOSE 4000

RUN rm -f package.json 