const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const { extractContent } = require('../scraping/news.js');
const keywords = require('./keywords.json');
const links = require('./links.json');

const generateLinks = async() => {
  let totalLinks = [];

  for (i in links) {
    try {
      let data = await extractContent(links[i], 'vi');
      if (!data)
        console.log('Failed to extract ' + links[i]);
      else {
        totalLinks = totalLinks.concat(data);
        console.log('Extracted ' + data.link);
      }
    } catch(err) {
      console.log(err);
    }
  }

  fs.writeFileAsync('./tests/input-links.json', JSON.stringify(totalLinks), 'utf-8')
  .then(() => {
    console.log('Generating links file finished!');
  })
  .catch(err => {
    console.log(err);
  });
};

const generateKeywords = () => {
  const totalLinks = require('./input-links.json');
  let results = [];
  for (i in keywords) {
    relateLinks = [];
    let data = {
      keyword: keywords[i],
      relateLinks
    };
    for (j in totalLinks)
      if (totalLinks[j].title.indexOf(keywords[i]) !== -1 || totalLinks[j].content.indexOf(keywords[i]) !== -1)
        relateLinks = relateLinks.concat(totalLinks[j].link);
    data.relateLinks = relateLinks;
    results = results.concat(data);
  }
  // console.log(results);

  fs.writeFileAsync('./tests/input-keywords.json', JSON.stringify(results), 'utf-8')
  .then(() => {
    console.log('Generating keywords file finished!');
  })
  .catch(err => {
    console.log(err);
  });
};

const generateNoneDiacriticTest = () => {
  const diacritic = require('diacritic');

  fs.readFileAsync('./tests/input-keywords.json', 'utf-8')
  .then(list => {
    list = JSON.parse(list);
    let results = [];
    results = results.concat(list);
    for (let i = 28; i < keywords.length; i++) {
      let data = {
        keyword: keywords[i],
        relateLinks: list[i-28].relateLinks
      };
      results = results.concat(data);
    }
    fs.writeFileAsync('./tests/output-keywords.json', JSON.stringify(results), 'utf-8')
    .then(() => {
      console.log('Generating none diacritic test finished!');
    })
    .catch(err => {
      console.log(err);
    });
  })
  .catch(err => {
    console.log(err);
  });
}

// generateLinks();
// generateKeywords();
generateNoneDiacriticTest();
