# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install  --force

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the server
CMD ["npm", "start"]