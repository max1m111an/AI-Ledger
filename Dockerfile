FROM python:3.12.11 AS ledger

RUN apt-get update && apt-get install -y libzbar0 libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt ./
RUN ["python3", "-m", "pip", "install", "--no-deps", "--no-cache-dir", "-r", "requirements.txt"]

WORKDIR "/app"
ENTRYPOINT ["python3", "-m", "uvicorn"]

FROM node:alpine AS reactapp

WORKDIR "/app"
ENTRYPOINT ["npm"]

FROM nginx:alpine as reverseproxy

FROM mariadb:latest as database

FROM phpmyadmin:latest as dbadmin