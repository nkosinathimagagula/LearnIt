# 1. Start with a base image (Node version 20)
FROM node:20-alpine

# 2. Set a working directory inside the container for the app
WORKDIR /app

# 3. Copy package files first [leverage Layer Caching]
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your source code into the container
COPY . .

# 6. Tell Docker which port the app runs on
EXPOSE 3000

# 7. The command to start the app
CMD ["node", "index.js"]