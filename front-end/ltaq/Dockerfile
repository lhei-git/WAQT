FROM node:18.8.0
COPY . /waqt/
WORKDIR /waqt
RUN npm install
RUN npm run build

FROM nginx

COPY --from=build /waqt/build/ /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]