FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY ./ .
RUN yarn build

FROM docker.io/nginx:latest as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY scripts/start.sh /start.sh

RUN chmod +x /start.sh
ENTRYPOINT ["/start.sh"]