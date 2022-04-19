# Timsheets NodeJS Application

## Table of Contents

- [Intro](#intro)
- [Setup](#setup)
- [Database Structure](#database-structure)


# [Intro]

This is a simple application written in nodejs v1.6x. It connects to a mongo & mysql database.The middleware is handled by ExpressJs.

The app has recently been Dockerized for ease of use & deployment.

# [Setup] 

The setup is easy. Clone repo to you server/local machine. Ensure the following is installed:

## Install Docker & Docker-Compose

https://docs.docker.com/install/linux/docker-ce/ubuntu/

Docker-Compose:

```
$ sudo apt install docker-compose
```

Environment File:

```
$ sudo touch .env
```
.env file contents:

```
### APP
ENV=PRD
TIMESHEET_PORTS_MAPPING=8020:8020
NODE_DOCKER_PORT=8020
MY_SQL_APP_PORT=3306
MY_SQL_RETRY=5
MY_SQL_RETRY_TIMEOUT=60000
REPORT_EXPORT_HOST=127.0.01

### MONGODB
MONGO_VOLUME=/root/docker/mongodb/data:/data/db
MONGO_PORTS_MAPPING=27017:27017
MONGO_PORT=27017
MONGO_HOST=mongodb
MONGO_DB=Timesheets

### MYSQL
MY_SQL_ROOT_PASSWORD=password
MY_SQL_DATABASE=Timesheets
MY_SQL_USER=root
MY_SQL_PORT=3306
MY_SQL_PORTS_MAPPING=3306:3306
MY_SQL_HOST=mysqldb
MY_SQL_VOLUME=/root/docker/mysql/data:/var/lib/mysql
MY_SQL_ALLOW_EMPTY_PASSWORD=no
```

# [Database Structure]

## Mongodb:

The database will created by docker-compose. No additional steps required.

### Should for any reason, the database is not created:

`ssh` into mongodb container:

```
$ docker exec -it mongodb_container /bin/bash
```

Connect to mongo instance:

```
mongo --host localhost:2701
```

Create db:

```
use Timsheets
```

Create collections:

```
db.createCollection("users")
db.createCollection("logs")
db.createCollection("setts")
```

### To restore a database:

Create a dump of existing database hosted on local/anywhere else

```
$ mongodump --db=Timesheets
```

Copy dump into container (mongodb_container)

```
docker cp /location_of_dump_on_host mongodb_container:/var
```

`ssh` into mongodb container:

```
$ docker exec -it mongodb_container /bin/bash
```

Restore database from whithin container:
```
$ mongorestore /var/dump
```

> Restore should be complete.

## Mysql:
Once the container is up, you can proceed to initializing the database via api call the the app.

### Postman
In the repo, there should postman collection: timesheets local.postman_collection.json
Import it into postman, and invoke the post call:
- Timesheets App\init\Init MysqlDB

On success, the response should be as follows:
```json
{
    "message": "Tables created successfully"
}
```

# App
The databases are up and the app is ready.

Adding Categories:
- Navigate to Settings
- Add CATEGORY
- Next, add SUB CATEGORY.
- You can then proceed to link CATEGORY & SUB CATEGORY from the CATEGORY Section.
- Finally, you can add the PROJECT NAME



