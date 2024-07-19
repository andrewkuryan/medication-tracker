# Medication Tracker

## Usage

### 1. Initialize .env files

#### a. Create `server/.env` file and fill all the params according to the [example](https://github.com/andrewkuryan/medication-tracker/blob/main/server/.env.example):

- `POSTGRES_USER` - name of the user which will have access to the database
- `POSTGRES_PASSWORD` - password of the user
- `POSTGRES_HOST` - hostname of the launched DB client
- `POSTGRES_PORT` - URL port of the launched DB client

#### b. Create `.env` file and fill all the params according to the [example](https://github.com/andrewkuryan/medication-tracker/blob/main/.env.example):

- `SRP_N` - N parameter of the SRP algorithm
- `SRP_G` - g parameter of the SRP
- `SERVER_HOST` - hostname of the launched server instance
- `SERVER_PORT` - URL port of the launched server instance

### 2. Set up the database

- Make sure you have installed the latest version of Docker Compose.
- Start a database container:

```shell
cd server
docker compose up
```

### 3. Install dependencies

- Install root dependencies

```shell
npm install
```

- Install server dependencies

```shell
cd server
npm install
```

- Install mobile dependencies

```shell
cd mobile
npm install
```

### 4. DB script usage

Your can use the following commands from the `server/` directory:

- `npm run db migrate` - create all tables in the PostgreSQL DB
- `npm run db migrate:undo` - revert the previous action

### 5. Launch

- Launch API server

```shell
cd server
npm start
```

- Launch the mobile application according to
  the [React Native README](https://github.com/andrewkuryan/medication-tracker/blob/main/mobile/README.md)
