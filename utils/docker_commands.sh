#!/bin/bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up--force-recreate