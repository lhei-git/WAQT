# pull official base image
#macos: DOCKER_BUILDKIT=0 docker build ...
FROM node:18.8.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --force --fetch-timeout=60000


# add app
COPY . ./

# start app
CMD ["npm", "start"]