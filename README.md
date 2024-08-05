# Description

This is a [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. This api includes library functionalities like; getting book summarry, and getting book by publisher and title, with a PostgreSQL database managed by Prisma.

## Postman Collection

[postman collection](book-api.postman_collection.json)

## API Documentation

You can view the API documentation at [API Documentation](http://localhost:3000/api).

## Prerequisites

- Node.js (v14.x or later)
- Yarn (v1.x or later)
- Docker (for running RabbitMQ and PostgreSQL containers)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

yarn install
```

## setup

```
Environment variables

DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?schema=public

OPENAI_API_KEY=your-openai-api-key

```

Run migration and seed the database

```

npx prisma migrate dev

```

Running the API with docker

```

docker-compose up -d

```

start in prod
docker run --env-file .env -p 3331:3000 nestjs-app

```

### Without Docker

Ensure you have PostgreSQL is running locally or remotely and update the .env file with the correct connection strings.

Run migrations and seed the database: `npx prisma migrate dev`

### start application

```

# development

$ yarn run start

# watch mode

$ yarn run start:dev

# production mode

$ yarn run start:prod

```

### Test

# unit tests

$ yarn run test

# e2e tests

```

yarn run pretest:e2e

yarn run test:e2e

```

# test coverage

$ yarn run test:cov

```

```

```
