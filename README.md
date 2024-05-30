# moviebase-backend

#### Movie database search application with 3rd party data sync and load measurement

## Setup

0. Clone this repository

```
git clone https://github.com/garilka/moviebase-backend.git
```

1. Go to the repository

```
cd moviebase-backend
```

2. Use project node version

```
nvm use
```

3. Install dependecies

```
npm i
```

4. Create .env based on .env.example

5. Create Postgresql docker container based on .env

```
export $(grep -v '^#' .env | xargs) && docker run -d --name postgresMoviebaseContainer -p $DB_PORT:5432 -e POSTGRES_PASSWORD=$DB_PASSWORD postgres
```

ℹ️ If you run this command outside the moviebase-backend repository the script won't be able to load the .env

6. Create database schema with Prisma migration

```
npx prisma migrate dev
```

7. Generate Prisma client

```
npx prisma generate
```

8. Create Redis container

```
export $(grep -v '^#' .env | xargs) && docker run -d --name redisMoviebase -p $REDIS_PORT:6379 -it redis/redis-stack-server:latest
```

9. Start the backend server 🚀

```
npm start
```
