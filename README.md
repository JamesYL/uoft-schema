# uoft-schema

A PostgreSQL database for describing relations for UofT. Includes scripts to call UofT API with parsing and typing. Data is given in CSV files that can be edited directly to update the database.

## Requirements

- Node 14
- npm 7
- Docker

## Getting Started

1. `npm install`
2. `npm run docker`

## Development

`npm run datagen`

- Anything related to the data is under [./data](./data). The includes scripts for parsing data gathered by UofT's API.
- [./datagen/datagen.ts](./datagen/datagen.ts) is the entry file that gets called when this command gets ran. Subsequent script files are called through this file.

`npm run gui`

- Some data needs to be manually parsed due to the complexity of the format. This command starts up a frontend that provides an easy way to parse the data.

`npm run access`

- Interactive terminal for working with Postgres

`npm run reset`

- Recreates the database with all data taken from [./data/csv](./data/csv)

`npm run lint`

- Runs the linter
