# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install all dependencies
RUN yarn install

# Copy the local source files to the container
COPY . .

# Build the React application
RUN yarn run build

# The CMD here can be adjusted based on how you choose to serve the build files,
# for now, we'll just list the build directory as the last step
CMD ["ls", "-l", "/app/build"]
