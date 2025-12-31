# ---------- Stage 1: Build React App ----------
FROM node:22.6.0 AS build

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install --force

# Copy source and build
COPY . .
RUN npm run build

# ---------- Stage 2: Serve with Apache ----------
FROM httpd:alpine

# Copy React build folder
COPY --from=build /app/build /usr/local/apache2/htdocs

# Optional: React Router support (SPA)
# You can use a .htaccess file if needed
COPY ./.htaccess /usr/local/apache2/htdocs

# Custom 404 page (optional)
#COPY src/404.html /usr/local/apache2/htdocs/404.html

# Enable mod_rewrite for SPA routing
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf \
  && { \
      echo 'IncludeOptional conf.d/*.conf'; \
      echo 'ErrorDocument 404 /404.html'; \
    } >> /usr/local/apache2/conf/httpd.conf \
  && mkdir -p /usr/local/apache2/conf.d

EXPOSE 80

CMD ["httpd-foreground"]
