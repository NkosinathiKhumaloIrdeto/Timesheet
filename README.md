# Timsheets NodeJS Application

## Table of Contents

- [Intro](#intro)
- [Setup](#setup)
- [Database Structure](#database-structure)

## [Intro]

This is a simple application written in nodejs v1.6x. It connects to a mongo database.The middleware is handled by ExpressJs.

## [Setup] 

The setup is easy. Clone repo to you server/local machine. Ensure the following is installed:

### npm dependencies
[pm2 ] installed globaly

```
$ npm install pm2 -g
```

MongoDb to be installed on local system


## [Database Structure]

ssh into mongodb container

```
$ docker exec -it mongodb_container /bin/bash
```

Connect to mongo instance

```
mongo --host localhost:2701
```

Create db:

```
use Timsheets
```

Create collections

```
db.createCollection("users")
db.createCollection("logs")
db.createCollection("setts")
```

### Collections
