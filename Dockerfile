FROM python:3.12.11 AS ledger

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libglx0 \
    libglu1-mesa \
    ccache \
    && rm -rf /var/lib/apt/lists/*


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
