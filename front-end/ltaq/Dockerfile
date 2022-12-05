FROM node:18.8.0-alpine as build-step
COPY . /waq/
WORKDIR /waq
RUN npm install --force
RUN npm run build


FROM nginx:alpine
COPY --from=build /waq/build/ /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]