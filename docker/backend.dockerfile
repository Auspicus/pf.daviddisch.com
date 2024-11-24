FROM node:20-bullseye as runner

EXPOSE 8000

COPY ./server.ts /app/server.ts
COPY ./tsconfig.json /app/tsconfig.json
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm i

CMD npm run start:server