FROM nginx:1.15.12

COPY html /usr/share/nginx/html

RUN apt-get update && apt-get install curl -y