# pull official base image
FROM node:18.17.1-alpine as builder

WORKDIR /app

# Copies everything over to Docker environment
COPY . .

# Installs all node packages
RUN yarn

# Build all packages
RUN yarn build

# Build the admin package for medusa
RUN yarn --cwd packages/admin build:admin

# ------------------------------------------------------------------------
FROM nginx:1.19.0

# Set the working directory
WORKDIR /usr/share/nginx/html

# Remove the default nginx static files
RUN rm -rf ./*

# Copy the build files from the previous stage
COPY --from=builder /app/packages/admin/build .

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 80

# Serve the app
ENTRYPOINT ["nginx", "-g", "daemon off;"]

LABEL org.opencontainers.image.source="https://github.com/Aldiwildan77/kilap-ecommerce-admin-ui"
