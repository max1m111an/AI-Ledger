FROM python:3.12.11 AS ledger

COPY ./requirements.txt ./
RUN ["python3", "-m", "pip", "install", "--no-deps", "--no-cache-dir", "-r", "requirements.txt"]

WORKDIR "/app"
ENTRYPOINT ["python3", "-m", "uvicorn"]

FROM node:alpine AS reactapp

WORKDIR "/app"
ENTRYPOINT ["npm"]
