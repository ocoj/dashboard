FROM node:22-alpine

WORKDIR /usr/share/nginx/html

# configure supervisor
COPY docker/supervisord.conf /etc/supervisord.conf
# copy build files
COPY out/ /usr/share/nginx/html/