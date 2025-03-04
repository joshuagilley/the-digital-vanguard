#!/bin/bash
echo "Hello, I'm working!"
git pull origin main
docker-compose down
docker-compose up -d