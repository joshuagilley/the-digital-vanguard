FROM node:latest

ENV DOCKER_ENV=true

WORKDIR /app

COPY package.json package-lock.json* .

RUN npm install --force

COPY . .

# RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "start" ]