# NEST JS API Tutorial

1. Docker compose file

```yaml
version: '3.8'
services:
  sandbox-postgres:
    image: postgres:14
    ports:
      - 5400:5432
    environment:
      POSTGRES_USER: postgres # change this
      POSTGRES_PASSWORD: password # change this
      POSTGRES_DB: database # change this
    volumes:
      - type: volume
        source: example_volume_name # change this
        target: /data
        volume:
          nocopy: true
volumes:
  # change this
  example_volume_name:
```

2. Environment file

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5400/database?schema=public"
```
