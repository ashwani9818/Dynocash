FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install

CMD ["sh", "-c", "npm run build && npm start"]
