FROM node:18.8.0-alpine as build-step
WORKDIR /app
ENV PATH node_modules/.bin:$PATH
COPY package.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install --force
RUN npm build


FROM nginx:stable-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
COPY nginx/nginx.default.conf /etc/nginx/conf.d/default.conf