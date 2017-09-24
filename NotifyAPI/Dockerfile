FROM node:latest
LABEL Name=notify-api Version=1.0.0
COPY package.json /tmp/package.json

RUN yarn global add pm2
RUN cd /tmp && yarn
RUN mkdir -p /usr/src/app && mv /tmp/node_modules /usr/src
WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 8080

CMD ["pm2-docker", "indexing.js"]
