const elastic = require('elasticsearch');
const client = new elastic.Client({
  host: 'localhost:9200'
});

const links = require('./generate/input-links.json');
const { saveArticle } = require('../../scraping/news');
const { searchArticles } = require('../../controllers/search');

const indexArticles = async(data) => {
  let success = 0;
  for (i in data) {
    try {
      await saveArticle(data[i], 'vi');
      success++;
    } catch(err) {
      console.log(err);
    }
  }
  console.log(success + '/' + data.length + ' indexed!');
};

const analyzeArticle = async(data) => {
  try {
    let results = await client.indices.analyze({
      index: 'articles',
      analyzer: 'vn_non_diacritic',
      text: 'Mặc dù đã chính thức đường ai nấy đi nhưng ngay sau khi tin đồn Cường Đô la đang yêu chân dài Đàm Thu Trang thì dư luận lại quan tâm đến chuyện phản ứng của Hạ Vi trước thông tin này.'
    });
    console.log(results.tokens);
  } catch(err) {
    console.log(err);
  }
};

const f1Score = async() => {
  const keywords = require('./generate/output-keywords.json');
  let avg = 0;
  for (let i = 0; i < keywords.length; i++) {
    try {
      let results = await searchArticles(keywords[i].keyword);
      let tp = 0;
      for (let j = 0; j < results.length; j++)
        if (keywords[i].relateLinks.indexOf(results[j]) !== -1)
          tp++;
      let recall = tp / keywords[i].relateLinks.length;
      let precision = results.length === 0 ? 0 : tp / results.length;
      let f1 = (precision + recall) === 0 ? 0 : 2 * (precision * recall) / (precision + recall);
      avg += f1;
      console.log(keywords[i].keyword + ': ' + f1);
    } catch(err) {
      console.log(err);
    }
  }
  console.log('Average F1 Score: ' + avg / keywords.length);
};

// analyzeArticle(links[0]);
// indexArticles(links);
searchArticles('bảo thanh');
// f1Score();
