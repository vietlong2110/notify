# Notify
Notification app from all reliable sources with subscribed topic from other social network

## Requirement
Node version: v8.1+ <br />
Mongo version: v3.4+ <br />
Elasticsearch version: v5.4.1 <br />
Elasticsearch vietnamese analysis version: v5.4.1 (https://github.com/duydo/elasticsearch-analysis-vietnamese)

## Usage
[file/to/elastic/folder/]bin/elasticsearch <br />
yarn global add pm2 (npm install -g pm2) <br />
cd NotifyAPI <br />
yarn(npm) install <br />
node scripts/rssCrawler.js <br />
pm2 start indexing.js

## Folder Structure
- NotifyAPI
  - api
    - api.js (Write API router in this file)
    - tests.js (Write testing API router in this file)
  - controllers (Controllers folder)
    - facebook.js
    - index.js
    - search.js
  - libs (Internal libs)
    - extractor (extract content of a html body)
    - feed-reader (read feed from rss/atom)
  - models (database schema)
    - Articles.js (store indexed articles)
    - index.js
    - mongoosastic.js (mongoosastic configuration)
    - Sources.js (store rss feeds from seeds/vi-sources.txt)
  - scraping
    - news.js (crawl, extract, index articles)
  - scripts (scripts to run independent tasks)
    - rssCrawler.js (crawl rss from seeds/vi-sources.txt)
  - seeds
    - vi-sources.txt
  - tests (testing folder)
    - search (test search performance)
    - unit (unit testing)
  - app.js (API gate 8080)
  - indexing.js (index articles from feeds)
  - database.js (connect mongodb)
