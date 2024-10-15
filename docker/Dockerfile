FROM nginx:latest

ENV http_proxy=http://192.168.192.7:7890
ENV https_proxy=http://192.168.192.7:7890

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

COPY ./dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Download BBDown backend and set it up
WORKDIR /bbdown
ADD https://github.com/nilaoda/BBDown/releases/download/1.6.3/BBDown_1.6.3_20240814_linux-x64.zip .
RUN unzip BBDown_1.6.3_20240814_linux-x64.zip
RUN rm BBDown_1.6.3_20240814_linux-x64.zip
RUN chmod +x BBDown
COPY ./BBDown.config /bbdown/BBDown.config

# Add backend startup script
COPY ./start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
EXPOSE 8080

VOLUME /downloads

CMD ["/bin/bash", "/start.sh"]
