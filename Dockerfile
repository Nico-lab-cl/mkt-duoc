# Stage 1: Build React Frontend
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run Express Server
FROM node:20-alpine
WORKDIR /app

# Copy package files for server dependencies
COPY package*.json ./
RUN npm install --production

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy server code
COPY server ./server

# Set environment variables (should be overridden in Easypanel)
ENV PORT=80
ENV DATABASE_URL=postgres://nicolas:cabrera@evolution-api_duoc-db:5432/duoc1?sslmode=disable

EXPOSE 80

CMD ["node", "server/index.js"]
