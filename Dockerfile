FROM node:slim

WORKDIR /promptmgr-lfag
COPY package*.json ./
RUN npm install
COPY . /promptmgr-lfag

CMD ["npm", "start"]
