# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install --production

# Copy project files
COPY . .

# Expose app port
EXPOSE 5000

# Run app
CMD ["node", "app.js"]
