# uoft-schema

A PostgreSQL database for describing relations for UofT. Includes scripts to call UofT API with parsing and typing. Data is given in CSV files that can be edited directly to update the database.

## Requirements

- Node 14
- Docker

## Getting Started

1. `npm install`
2. `npm run docker`

## Development

`npm run datagen`

- Anything related to the data is under [./data](./data). The includes scripts for parsing data gathered by UofT's API.
- [./data/data_gen.ts](./data/data_gen.ts) is the entry file that gets called when this command gets ran. Subsequent script files are called through this file.
- Not everything can be automated. Manual parsing of the data is still necessary.

`npm run access`

- Interactive terminal for working with Postgres

`npm run reset`

- Recreates the database with all data taken from [./data/csv](./data/csv)

`npm run lint`

- Runs the linter
