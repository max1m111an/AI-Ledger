FROM python:3.12.11 AS ledger

COPY ./requirements.txt ./
RUN ["python3", "-m", "pip", "install", "--no-deps", "--no-cache-dir", "-r", "requirements.txt"]

WORKDIR "/app"
ENTRYPOINT ["python3", "-m", "uvicorn"]

FROM node:20-bullseye AS reactapp
WORKDIR /app

COPY ./apps/frontend/package*.json ./

RUN npm install

COPY ./apps/frontend ./

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM nginx:alpine as reverseproxy
