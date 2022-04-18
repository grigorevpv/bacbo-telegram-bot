FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install
# Bundle app source

RUN npm run build

CMD [ "node", "dist/app.js" ]