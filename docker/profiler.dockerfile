FROM --platform=linux/amd64 ghcr.io/puppeteer/puppeteer:23 as runner

WORKDIR /app

RUN mkdir /tmp/traces

VOLUME /tmp/traces

COPY ./package.json /app/package.json
# COPY ./package-lock.json /app/package-lock.json

RUN npm i

COPY ./profile.ts /app/profile.ts
COPY ./tsconfig.json /app/tsconfig.json

CMD npm run start:profile
# CMD xvfb-run --server-args="-screen 0 1024x768x24" npm run start:profile
# CMD ["/bin/bash", "-c", "while true; do sleep 1; done"]