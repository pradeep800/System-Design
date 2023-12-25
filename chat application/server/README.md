### For Running Container

```
docker compose up --build
```

### for running redis

```
sudo docker run -d --name redis -p 6379:6379 redis:latest redis-server --bind 0.0.0.0 --port 6379
```
