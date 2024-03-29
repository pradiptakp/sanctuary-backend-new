FROM node:14-alpine

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install
RUN apk add curl
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 3002

CMD [ "yarn", "start" ]