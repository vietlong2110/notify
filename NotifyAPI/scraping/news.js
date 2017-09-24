const extractor = require('../libs/extractor');
const fetch = require('isomorphic-fetch');
const _ = require('lodash');

const feedparser = require('../libs/feed-reader/main.js');
const { Articles } = require('../database');

const RSS = 'http://feeds.bbci.co.uk/vietnamese/rss.xml';
const DEFAULT_LANG = 'vi';
const DEFAULT_TIMEOUT = 10000;

const today = (date, timezone = 7) => {
  let now = new Date();
  now.setUTCHours(now.getUTCHours());
  date = new Date(date);
  return ((now - date) / 1000 / 3600 <= 24);
};

const fetchFeed = async(rss = RSS) => {
  try {
    let feed = await feedparser.parse(rss);
    feed = feed.entries;
    let data = [];

    for (i in feed) {
      let { link, content, contentSnippet, publishedDate, title } = feed[i];
      // if (today(publishedDate))
        data = [...data, { link, content, contentSnippet, publishedDate, title }];
    }
    return Promise.resolve(data);
  } catch(err) {
    // console.log(err);
    return Promise.reject(err);
  }
};

const extractContent = async(link, language = DEFAULT_LANG, title = '', content = '', description = '', publishedDate, source = '') => {
  try {
    let response = await fetch(link, { timeout: DEFAULT_TIMEOUT });
    let html = await response.text();
    let extractedData = extractor.lazy(html, language);
    let data = {
      link, publishedDate, source,
      content: content || extractedData.text(),
      title: title || extractedData.title(),
      image: extractedData.image(),
      tags: extractedData.tags(),
      description: description || extractedData.description()
    };
    // console.log(data);
    console.log('Extracted ' + link);
    return Promise.resolve(data);
  } catch(err) {
    console.log('ERROR OCCURED when EXTRACTING ' + link);
    return Promise.reject(err);
  }
};

const saveArticle = async(data, language = DEFAULT_LANG) => {
  let { link, publishedDate, content, title, image, tags, description, source } = data;
  try {
    let newArticle = new Articles({
      link, publishedDate, content, title, image, tags, description, language, source
    });
    await newArticle.save();
    console.log('Indexed ' + link);
    return Promise.resolve();
  } catch(err) {
    console.log('ERROR OCCURED when INDEXING ' + link);
    return Promise.reject(err);
  }
};

const fetchNews = async(rss, language = DEFAULT_LANG, source = '') => {
  // const { Articles } = require('../database');

  try {
    console.log('FETCHING ' + rss + ' in ' + source + '\n');
    let links = await fetchFeed(rss);
    let listLinks = [], urls = [];

    for (i in links)
      listLinks = [...listLinks, links[i].link];
    try {
      let tmp = await Articles.find({ link: {'$in': listLinks }}).exec();
      let tmpList = [];
      for (i = 0; i < tmp.length; i++)
        tmpList = [...tmpList, tmp[i].link];
      // console.log('tmp: ' + tmpList.length);
      // console.log('links: ' + links.length);
      for (i in links)
        if (tmpList.indexOf(links[i].link) === -1)
          urls = [...urls, links[i]];
      // console.log('urls: ' + urls.length);
    } catch(err) {
      console.log(err);
    }

    if (urls.length === 0) {
      console.log('NO UPDATE in ' + rss + '\n');
      return Promise.resolve();
    }
    let success = 0;
    // console.log(urls);

    for (i in urls) {
      let { link, publishedDate, title, contentSnippet, content } = urls[i];
      try {
        let data = await extractContent(link, language, title, content, contentSnippet, publishedDate, source);
        await saveArticle(data, language);
        success++;
      } catch(err) {
        // console.log(err);
      }
    }
    console.log('INDEXING SUCCESSFULLY ' + success + '/' + urls.length + '\n');
    return Promise.resolve();
  } catch(err) {
    console.log('ERROR OCCURED when FETCHING ' + rss + '\n');
    return Promise.reject(err);
  }
};

// extractContent('http://dantri.com.vn/van-hoa/nhan-sac-viet-va-cong-cuoc-dem-chuong-di-danh-xu-nguoi-20170814075637553.htm');
// fetchFeed();
module.exports = {
  fetchFeed,
  extractContent,
  saveArticle,
  fetchNews
};
