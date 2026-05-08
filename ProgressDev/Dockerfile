FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build application
# Note: Ensure all required build-time env vars are present
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
