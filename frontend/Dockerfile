# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite will read .env.production inside the image if present
RUN npm run build

# Serve stage
FROM nginx:1.27-alpine
# Copy the built site
COPY --from=build /app/dist /usr/share/nginx/html
# Use our Nginx config that listens on 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run expects the container to listen on $PORT (8080)
EXPOSE 8080
