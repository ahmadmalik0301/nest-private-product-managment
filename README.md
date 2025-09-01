# Private Product Management API

A **RESTful API** built with **NestJS** for managing private products.

## Features

- **User Registration**: Users can sign up with their email. Upon registration, a welcome email is sent automatically using **SendGrid**.
- **Authentication & Authorization**: Secured with **PASSPORT JWT** to handle user authentication . User can only manage his own products
- **Email Queueing**: Utilizes **BullMQ** with **Redis** to manage email sending asynchronously.
- **Dockerized Setup**: Runs **PostgreSQL** and **Redis** in containers for easy setup and deployment.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [BullMQ](https://docs.bullmq.io/)
- [SendGrid](https://sendgrid.com/)
- [Docker](https://www.docker.com/)
- [Passport-jwt](https://www.passportjs.org/packages/passport-jwt/)

## Setup

- npm install
- setup .env
  - DATABASE_URL=...
  - JWT_SECRET=...
  - SENDER_EMAIL=...
  - SGMAIL_AUTH=...
- docker compose up -d
- npx prisma migrate dev
- npm run start:dev or npm run start:prod
