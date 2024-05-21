# Use the official Node.js 16 image as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install Yarn and project dependencies
RUN yarn install

# Make port 3001 available to the world outside this container
EXPOSE 5000

# Run the app when the container launches
CMD ["yarn", "start"]