FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# Bundle app source
COPY . .

RUN npm run build

CMD [ "node", "dist/app.js" ]