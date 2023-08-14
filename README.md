# Node-Storage-Service

## Overview

- Implement a basic object storage service with API similar to S3
- Use Express for web framework
- MongoDB for metadata database
- Local filesystem for object storage

### API Endpoints

- `POST /register` - creates User

```
{
"name": "hello",
"email": "hellu@gmail.com", //should be unique
"password": "hello1234"
}
```

- `GET /login` - login with user

```
{
"email": "hellu@gmail.com",
"password": "hello1234"
}
```

- `GET /buckets` - List buckets
- `GET /buckets/:bucketName` - List objects in bucket
- `PUT /buckets/:bucketName` - Create object
- `GET /buckets/:bucketName/:object` - Get object
- `DELETE /buckets/:bucketName/:object` - Delete object
