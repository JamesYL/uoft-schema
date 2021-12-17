# uoft-schema

A PostgreSQL database for describing relations for UofT. Includes scripts to call UofT API with parsing and typing. Data is given in CSV files that can be edited directly to update the database.

## Requirements

- Node 14
- Docker

## Getting Started

Do `docker-compose up -d` to spin up the instance of PostgreSQL with the data automatically copied over.

## Generating Data

Anything related to the data is under [./data](./data). The includes scripts for parsing data gathered by UofT's API. Use `npm run datagen` to run these scripts.  
Look into [./data/data_gen.ts](./data/data_gen.ts) for more information on what actually happens.  
Not everything can be automated. The format is often not given nicely, and some data needs to be manually parsed.

## More Info

CSV files under [./data/csv](./data/csv) are synced to initializing the database in the docker container.  
The database needs to be re-initialized to get these updated values.

1. `docker-compose down -v`
2. `docker-compose up -d`

To access the database:

1. `docker exec -it uoft-postgres /bin/bash`
2. `psql -U postgres`
3. `\c uoft`
