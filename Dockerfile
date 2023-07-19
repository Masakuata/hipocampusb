FROM node:lts-alpine3.18

WORKDIR /app

COPY package*.json /app

COPY tsconfig*.json /app

RUN npm install

COPY . /app

EXPOSE 42300

CMD ["npm", "run", "start:dev"]
