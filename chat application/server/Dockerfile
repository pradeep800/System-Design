FROM node:slim
WORKDIR /home/app/
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm run build

CMD ["npm", "start"]
