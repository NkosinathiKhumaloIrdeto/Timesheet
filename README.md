# Timsheets NodeJS Application

## Table of Contents

- [Intro](#intro)
- [Setup](#setup)
- [Database Structure](#database-structure)

## [Intro]

This is a simple application written in nodejs v1.6x. It connects to a mongo database.The middleware is handled by ExpressJs.

## [Setup] 

The setup is easy. Clone repo to you server/local machine. Ensure the following is installed:

### Install Docker & Docker-Compose

https://docs.docker.com/install/linux/docker-ce/ubuntu/

Docker-Compose:

```
$ sudo apt install docker-compose
```

MongoDb to be installed on local system


## [Database Structure]

### To create a new database:

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

