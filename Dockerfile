FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY index.html index.html
COPY index.js index.js
EXPOSE 8080
CMD [ "node", "index.js" ]

