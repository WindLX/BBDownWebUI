#!/bin/bash

# Start BBDown backend service
nohup ./BBDown serve -l http://127.0.0.1:8080 &

# Start Nginx to serve the frontend and proxy requests
nginx -g 'daemon off;'
