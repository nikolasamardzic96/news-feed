# News Feed assignment - MVP workshop

1. [Installation](##Installation)
1. [Running the app](##Running-the-app)
1. [Deployment](##Deploying-the-app-on-docker)
1. [Migrations](###Migrations)
1. [Environment variables](###Migrations)
## Installation

```bash
$ npm install
```

### Migrations
​
To run all migrations and test data using the command:
```bash
npm run migration:up
```
To roll back one migration use command:
```bash
npm run migration:down
```
To create migration file use command:
```bash
npm run migration:create
```

## Environment variables

### MongoDB
To connect with *mongoDB* we will need to edit **.env** file. 
- Change `DATABASE` constant to match mongoDB database
- Change `DB_HOST` constant to match mongoDB host
- Change `MONGO_DOCKER_PORT` constant to match mongoDB port
- Change `DB_NAME` constant to match mongoDB database name
- Change `DB_USERNAME` constant to match mongoDB database username
- Change `DB_PASSWORD` constant to match mongoDB database password
​- Change `AUTH_SOURCE` constant to match mongoDB authentication source

## Deploying the app on docker

Before running the application user should run `docker-compose up -d` in order to build and run mongoDB container, which the applications uses for its database. All env vars are set in .env file, and the applications connects by default to mongo container. Migrations also need to be run, because default sources are saved in the database.
In `src\news\news-feed.service.ts` you can change `CronExpression.EVERY_10_SECONDS` to `CronExpression.EVERY_30_SECONDS`. 10 second interval was used for testing purposes, for faster data retrieval. Code snippet inside cron takes about 40-80ms to execute with 7-8 test sources.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
