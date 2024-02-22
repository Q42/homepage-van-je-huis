# Homepage van je huis backend

In it's current form, the backend is designed to be ran locally. It scrapes / ingests a bunch of datasources and then uses this to generate a static api consisting of a load of json files, one for each address. This approach was chosen as it allows us to "normalize" and stabilize our datasources first so that we don't run into issues when generating the api. Some of the external data sources are not very performant and sometimes also not very stable.

The reasoning behind having a static api is to minimize hosting costs (no runtime) and make it very performant under peak loads. The source data also doesn't mutate very frequently anyways.

## ✨ See it in action ✨

| Environment | ...      |
| ----------- | -------- |
| `...`       | 🚧 / ... |

## 🧰 External tooling

-   System architecture [miro](https://miro.com/app/board/uXjVN4O0Egs=/)

## 🚀 Getting started

### Prerequisites

The backend doesn't require any special prerequisites, but it does rely on a bunch of (static) data sources, like csv files. These are not included in the repository. Some of which can be downloaded from the [amsterdam FTP server](https://www.amsterdam.nl/stelselpedia/producten-stelsel/schijf-ftp-server/). Check the pipelineConfig and `download-dataset.sh` to see which static sources are needed.

### Development

The system works by ingesting a bunch of csv files and running crawlers. This data is then written to an intermediate database format (parquet). In the api generation step, the various parquet files are loaded into one big database, which is then used to query against to generate the api.

**The most important files for the system** are in the configs directory. This is where a lot of the parameters for the ingest and output are defined. When you want to add a new CSV input source, you only have to add it to the `csvSourceConfig` file and the system will automatically pick it up and make it available for api generation. The crawlers are a bit more complex. These need to be added to the configs as well, but since there is not one generic crawler, you will also have to write a crawler class and instantiate it in the `runCrawlers.ts` file.

For the CSV sources, you need to specify the schema that needs to be used to map the csv columns to the correct data types in the intermediate database. You need to specify all the columnst that are present in the csv.

**Tip: don't write this schema yourself. Just dump the csv header, along with an example of the schema into ChatGPT and let it write the schema. Then you just need to check if it's correct.**

The pipelineconfig details all the generic system settings that are not related to specific sources or crawlers.

If you wish to prevent a specific crawler from running, you can set a flag in the crawlerconfig.

In its current form, there are three separate scripts: ingestFiles, runCrawlers and generateApi. Make sure to look at the [architecture](https://miro.com/app/board/uXjVN4O0Egs=/) before trying to run the system, so you know which scripts depend on the output of which other scripts.

In `generateAPI.ts` is where the various data sources are combined and where the api is generated. If you want to add or alter api output data, you need to do that here.

#### 🚨 IMPORTANT 🚨

Don't change the configs inbetween ingests, crawlers and generation runs. This will lead to the generation step not being able to find the correct files.

#### Developing duckdb queries & reading parquet files

When doing an ingest, crawler or api generation run, the scripts will also output .duckdb files. Parquet and duckdb files can both be opened and queried on using [dbeaver](https://dbeaver.io/). The [duckDB docs](https://duckdb.org/docs/guides/sql_editors/dbeaver.html) contain info on how to get this up and running.

For reading parquet files, don't open a .duckdb file, but load an in memory db and then run queries against the parquet file.
Example: `SELECGT * FROM "/Users/thomas/Projects/homepage-van-je-huis/src/backend/crawler_output/buitenkunst_crawler-run-2024-02-06T12:49:07.parquet"`

### Tweaking the system and analytics

It is possible to, in the pipeline config, enable the analytics service in the system. This will, after a generation run, output an analytics report. This report can then also be used to load a sample dataset in a new generation run. By consistently loading the same report, you can run tests on the same dataset and see how your tweaks affect the various address records.

### Deployment / Release process

Currently, everything is run locally, there is no deployment process (yet).

## 🤚 Good to know

-   The system uses duckDB to wrangle, join and transform the data. In the nodeJS api, this means writing a lot of SQL queries as strings. Beware, these queries do distinquish between single and double quotes, so make sure to use the right one for the right context and regularly test, since there is absolutely no type checking or intellisense.
-   The system outputs duckdb files. These are not needed for the generation step. They are solely for debugging purposes.
-   Some of the datasets also contain geometry data. This data is stored in special geometry type columns, which allow for spatial querying. When a spatial column is written to a parquet file, it first gets turned into a special kind of string, which is then transformed back into a geometry type when the parquet file is read. This is due to a limitation of the duckDB geometry implementation.
-   The coordinate system which is used in the various datasets is called [Rijksdriehoek](https://nl.wikipedia.org/wiki/Rijksdriehoeksco%C3%B6rdinaten). The system contains various utils that translates lat/long to Rijksdriehoek. This can be done both in JS, or through a duckDb query.
-   The public art website scraper produces quite a few "failure" listings in the failure log. This is due to not all pages on the website having all the required data. Some pages, for example, do not contain a geo location. This will then also result in a failure. This is not a problem, since the system is designed to handle these failures and just continue with the next page.
-   Questions? Ask [Wouter](https://arc.enterprise.slack.com/user/@U02KFD7J3) or [Thomas](https://arc.enterprise.slack.com/user/@U041JE72HF1).
