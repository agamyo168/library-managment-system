FROM node:23-alpine

WORKDIR /app

# COPY package.json .
COPY . .
RUN npm install

ENTRYPOINT ["sh","entrypoint.sh"]