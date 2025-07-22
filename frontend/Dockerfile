FROM node:21-bookworm-slim

ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

RUN apt-get update && \
    apt-get install -y locales curl procps && \
    locale-gen ja_JP.UTF-8 && \
    localedef -f UTF-8 -i ja_JP ja_JP

WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app

USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .

EXPOSE 3001

CMD ["npm", "run", "dev"]