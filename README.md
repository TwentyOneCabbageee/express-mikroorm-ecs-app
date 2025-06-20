# Express MikroORM ECS App

This project is a standalone Express API application built with TypeScript, utilizing MikroORM for database interactions and Jest for testing. It is designed to run locally and is ready for deployment on Amazon ECS.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd express-mikroorm-ecs-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your database configuration in `src/config/mikro-orm.config.ts`.

## Usage

To start the application locally, run:
```
npm run start
```

The server will be running on `http://localhost:3000`.

## Testing

To run unit tests, use:
```
npm run test:unit
```

For integration tests, use:
```
npm run test:integration
```

## Deployment

To build the Docker image, run:
```
docker build -t express-mikroorm-ecs-app .
```

You can then push the image to your container registry and deploy it using the ECS task definition defined in `ecs-task-def.json`.