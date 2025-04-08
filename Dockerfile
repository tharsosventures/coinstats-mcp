# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
# to leverage Docker cache
COPY package*.json ./

# Install project dependencies (only production)
# Assumes build (tsc) happens *before* docker build
RUN npm install --only=production

# Copy the rest of the application code, including the pre-built dist folder
COPY . .

# The MCP server listens on stdin/stdout, so no EXPOSE needed

# Command to run the application using the main script from package.json
CMD ["node", "dist/index.js"] 