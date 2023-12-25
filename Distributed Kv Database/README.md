# Replication In Postgres

create a postgres replica

```
services:
  db1:
    image: postgres:latest
    container_name: postgres-db1
    environment:
      POSTGRES_DB: database1
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    networks:
      - postgres-network
    volumes:
      - C:\Users\new\Documents\System Design\Kv database/pg-vol/postgres-1/data:/var/lib/postgresql/data
      - C:\Users\new\Documents\System Design\Kv database/pg-vol/postgres-1/archive:/mnt/server/archive

```

change some configuration in postgresql.conf

```
max_wal_senders = 3
archive_command = 'test ! -f /mnt/server/archive/%f && cp %p /mnt/server/archive/%f'
wal_level = replica
archive_mode = on
```

add in pg_hba.conf

```
host    replication    replicationUser  0.0.0.0/0               md5
```

go to terminal of this and execute these line

```
docker exec -it postgres-db1 bin/bash
createuser -U user -P -c 5 --replication replicationUser
password:
```

Now create a second container

```
rep1:
    image: postgres:latest
    container_name: replica-db1
    environment:
      POSTGRES_DB: replica1
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5434:5432"
    networks:
      - postgres-network
    volumes:
      - C:\Users\new\Documents\System Design\Kv database/pg-vol/replica-1/data:/data
```

Run this command inside container

```
docker exec -it replica-db1 bin/bash
pg_basebackup -h postgres-db1 -p 5432 -U replicationUser -D /data/ -Fp -Xs -R
password:
```

Now destroy this container

Create a new Container

```
rep1:
    image: postgres:latest
    container_name: replica-db1
    environment:
      POSTGRES_DB: replica1
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5434:5432"
    networks:
      - postgres-network
    volumes:
      - C:\Users\new\Documents\System Design\Kv database/pg-vol/replica-1/data:/var/lib/postgresql/data
```

now replica database is created which can only execute read commands

For going inside sql

```
psql --username user databaseName
```
