FROM node:20-alpine

WORKDIR /app

# Copy package files first to cache the npm install step
# The asterisk ensures it doesn't fail if package-lock.json isn't created yet
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

EXPOSE 3000

# Start the development server and expose it to the Docker network on port 3000
# (If you use Create React App instead of Vite, change this to CMD ["npm", "start"])
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]