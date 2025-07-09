# 1. ベースイメージの指定
FROM node:21-bookworm-slim

# 2. OSと環境変数の設定 (rootユーザーで実行)
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

RUN apt-get update && \
    apt-get install -y locales curl procps && \
    locale-gen ja_JP.UTF-8 && \
    localedef -f UTF-8 -i ja_JP ja_JP

RUN npm install -g @nestjs/cli

# 3. アプリケーションディレクトリの作成と権限移譲 (rootユーザーで実行)
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app

# 4. 一般ユーザーに切り替え
USER node

# 5. アプリケーションのセットアップ (nodeユーザーで実行)
COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npx prisma generate

EXPOSE 3000

# 6. 開発サーバーの起動コマンド
CMD ["npm", "run", "start:dev"]