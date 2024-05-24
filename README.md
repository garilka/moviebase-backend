# moviebase-backend

Backend setup

0. Clone this repository

```
   git clone https://github.com/garilka/moviebase-backend.git
```

1. Go to the repository

```
   cd moviebase-backend
```

1. Use project node version

```
   nvm use
```

2. Install dependecies

```
   npm i
```

3. Create .env based on .env.example

4. Create Postgresql docker container based on .env

```
   export $(grep -v '^#' .env | xargs) && docker run -d --name postgresMoviebaseContainer -p $DB_PORT:5432 -e POSTGRES_PASSWORD=$DB_PASSWORD postgres
```

ℹ️ If you run this command outside the moviebase-backend repository the script won't be able to load the .env

5. Create Prisma client

```
   npx prisma generate
```

6. Create database schema with Prisma migration

```
   npx prisma migrate dev
```

7. Start the backend server 🚀

```
   npm start
```
