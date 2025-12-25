FROM python:3.12.11 AS ledger

COPY ./requirements.txt ./
RUN ["python3", "-m", "pip", "install", "--no-deps", "--no-cache-dir", "-r", "requirements.txt"]

WORKDIR "/app"
ENTRYPOINT ["python3", "-m", "uvicorn"]

FROM node:20-alpine AS reactapp
WORKDIR /app

COPY ./apps/frontend/package*.json ./

RUN rm -rf node_modules package-lock.json

RUN npm install --no-cache --legacy-peer-deps esbuild@0.25.10
RUN npm install --no-cache --legacy-peer-deps

COPY ./apps/frontend ./

FROM nginx:alpine AS reverseproxy

FROM mariadb:latest AS database

FROM adminer:latest AS dbadmin
