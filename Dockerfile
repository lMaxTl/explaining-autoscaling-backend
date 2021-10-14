FROM node:14.16.1-alpine

WORKDIR /src

COPY ./package.json .

COPY ./tsconfig.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]