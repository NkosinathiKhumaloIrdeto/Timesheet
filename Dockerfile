FROM node:12.18
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY . .
EXPOSE 8020
CMD ["npm","start"]