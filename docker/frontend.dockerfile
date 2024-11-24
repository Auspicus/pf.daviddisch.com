FROM node:20-alpine as builder

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm i

COPY ./src /app/src
COPY ./public /app/public

RUN npm run build

FROM node:20-alpine as runner

EXPOSE 3000
COPY --from=builder /app/build /app/build

WORKDIR /app

RUN npm i -g serve

CMD serve -s ./build