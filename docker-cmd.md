# Without Docker compose

## Frontend

### build docker image: 
```
Dev: $ docker build -f Dockerfile.dev -t ms-frontend:latest .
Prod: $ docker build -f Dockerfile.prod -t ms-frontend:latest .
```

### run docker container: 
```
Dev: $ docker run --rm -p 5173:5173 ms-frontend:latest
Prod: $ docker run --rm -p 80:80 ms-frontend:latest
```

## User service

### build docker image
```
$ docker build -t ms-userservice:latest .
```
### run container
```
User-service Without db: $ docker run --rm -p 8000:8000 ms-userservice:latest

Postgres: $ docker run --rm -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=userdb  postgres:16-alpine

User-service With db: $ docker run --rm -p 8000:8000 -e DATABASE_URL=postgresql://admin:admin@10.166.218.139:5432/userdb ms-userservice:latest
````

## Product service

### build docker image
```
$ docker build -t ms-productservice:latest .
```
### run container
```
Product-service without db: $ docker run --rm -p 3001:3001 ms-productservice:latest

Mongodb: $ docker run --rm -p 27017:27017 -e MONGO_INITDB_ROOT_PASSWORD=admin -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_DATABASE=productdb mongo:7.0

Product-service With db: $ docker run --rm -p 3001:3001 -e MONGODB_URI=mongodb://admin:admin@10.166.218.139:27017/productdb?authSource=admin ms-productservice:latest
````


## Order service

### build docker image
```
$ docker build -t ms-orderservice:latest .
```
### run container
```
Product-service without db: $ docker run --rm -p 8082:8082 ms-orderservice:latest

Postgres: $ docker run --rm -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=orderdb  postgres:16-alpine

Product-service With db without Product-service: $ docker run --rm -p 8082:8082 -e SPRING_DATASOURCE_URL=jdbc:postgresql://10.166.218.139:5432/orderdb -e SPRING_DATASOURCE_USERNAME=admin -e SPRING_DATASOURCE_PASSWORD=admin ms-orderservice:latest
````



