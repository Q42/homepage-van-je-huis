# Homepage van je huis backend

In it's current form, the backend is designed to be ran locally. It scrapes / ingests a bunch of datasources and stores them in a local intermediate database format (parquet). These intermediate files are then used to generate a static api consisting of a load of json files. This approach was chosen as it allows us to "normalize" and stabilize our datasources first so that we don't run into issues when generating the api. Some of the external data sources are not very performant and sometimes also not very stable.

The reasoning behind having a static api is to minimize hosting costs (no runtime) and make it very performant under peak loads. The source data also doesn't mutate very frequently anyways.

## ✨ See it in action ✨

| Environment | ...      |
| ----------- | -------- |
| `...`       | 🚧 / ... |

## 🧰 External tooling

-   System architecture [miro](https://miro.com/app/board/uXjVN4O0Egs=/)

## 🚀 Getting started

### Prerequisites

The backend doesn't require any special prerequisites, but it does rely on a bunch of (static) data sources, like csv files. These are not included in the repository. Some of which can be downloaded from the [amsterdam FTP server](https://www.amsterdam.nl/stelselpedia/producten-stelsel/schijf-ftp-server/). Check the pipelineConfig.ts file to see which static sources are needed.

### Development

The most important file for the pipelines is the `pipelineConfig.ts`. This is where a lot of the parameters for the ingest and output are defined. When adding a new datasource, it needs to be added to the config, and in some cases, also to the dedicated processing script.

In its current form, there are three separate scripts: ingestFiles, runCrawlers and generateApi. Make sure to look at the [architecture](https://miro.com/app/board/uXjVN4O0Egs=/) before trying to run the system, so you know which scripts depend on the output of which other scripts.

#### Developing duckdb queries & reading parquet files

When doing an ingest, crawler or api generation run, the scripts will also output .duckdb files and, sometimes, parquet files. These can both be opened and queried on using a tool called dbeaver. The [duckDB docs](https://duckdb.org/docs/guides/sql_editors/dbeaver.html) contain info on how to get this up and running.

For reading parquet files, don't open a .duckdb file, but load an in memory db and then run queries against the parquet file.
Example: `SELECGT * FROM "/Users/thomas/Projects/homepage-van-je-huis/src/backend/crawler_output/buitenkunst_crawler-run-2024-02-06T12:49:07.parquet"`

### Deployment / Release process

Currently, everything is run locally, there is no deployment process (yet)

## 🤚 Good to know

-   The system uses duckDB to wrangle, join and transform the data. In the nodeJS api, this means writing a lot of SQL queries as strings. Beware, these queries do distinquish between single and double quotes, so make sure to use the right one for the right context and regularly test, since there is absolutely no type checking or intellisense.
-   Questions? Ask [Wouter](https://arc.enterprise.slack.com/user/@U02KFD7J3) or [Thomas](https://arc.enterprise.slack.com/user/@U041JE72HF1).
