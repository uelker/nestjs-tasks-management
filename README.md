# Tasks Management Service

This is a [NestJS](https://nestjs.com/) application that provides CRUD operations for managing tasks. A task is defined by a `title`, `description` and `status`.
This application uses [PostgreSQL](https://www.postgresql.org/) as its database and provides an [OpenAPI](https://swagger.io/specification/) documentation for its endpoints.

## Prerequisites

- Node.js v18.x or later installed on your machine
- Docker installed on your machine

## Setup

1. Clone the repository: `git clone https://github.com/uelker/nestjs-tasks-management.git`
2. Install dependencies: `npm install`
3. Navigate to the docker directory and run the following command: `docker-compose up -d`
4. Start the NestJS application: `npm run start`
4. Access the OpenAPI documentation at `http://localhost:3000/tasks-management-service/api`