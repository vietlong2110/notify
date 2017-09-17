const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const u = require('url');
const fetch = require('isomorphic-fetch');

const { fetchFeed } = require('../scraping/news');
const { Feeds, Sources } = require('../database');

const urlFilter = (url, parent_url) => { //create adaptable link to crawl
	let pu = u.parse(url), pp = u.parse(parent_url);

	let protocol = '';
	if (pu.protocol !== null)
		protocol = pu.protocol;
	if (!(protocol == 'http:' || protocol == 'https:' || protocol == '')) { //only follow http and https links
		// console.log('Not http or https');
		return '';
	}

	if (url.substr(0, 2) === "//") {
		url = pp.protocol + url;
		pu = u.parse(url);
		if (pu.hostname !== null && pu.hostname !== pp.hostname)
			return '';
	}
	else if (url.substr(0, 1) === "/") {
		// console.log(url);
		// console.log('Relative links /');
		url = pp.protocol + "//" + pp.hostname + url;
	}
	else if (pu.protocol === null) {
		// console.log(url);
		// console.log('Relative links');
		url = parent_url + url;
	}
	return url;
};

const parseLinks = (body, source) => { //parse all the links from the extracted content
	let links = [];
	let checkedURLs = [];//check dupliate link
	links.push(source);
	checkedURLs[source] = 1;

	//regex for <a href...
	const reg = /href\s*=\s*[\\\'\"]?([+:%\/\?~=&;\\\(\),._a-zA-Z0-9-]*)(#[.a-zA-Z0-9-]*)?[\\\'\" ]?(\s*rel\s*=\s*[\'\"]?(nofollow)[\'\"]?)?/ig;
	let arr = [];

	while ((arr = reg.exec(body)) !== null) {
		let url = urlFilter(arr[1], source);
		if (url !== '' && url.match(/(rss|feed)/) && !checkedURLs[url]) {
			links.push(url);
			checkedURLs[url] = 1;
		}
	}
	return links;
};

const crawl = () => {
  fs.readFileAsync('./seeds/vi-sources.txt', 'utf-8')
  .then(async(buffer) => {
    let rssArray = buffer.split('\n');

    for (i in rssArray) {
      let rss = rssArray[i].split(' ');
      let source = rss[0], feed = rss[1] || null;
			let urls = [];

			if (feed) {
				try {
					let response = await fetch(feed, { timeout: 30000 });
					let html = await response.text();
					urls = parseLinks(html, 'http://' + source);
					// console.log(urls);
				} catch(err) {
					console.log(err);
				}
			}
			else {
				try {
					let f = await Feeds.findOne({ url: source }).exec();
					if (f.feeds)
						urls = f.feeds;
				} catch(err) {
					console.log(err);
				}
			}
			let links = [];

			for (j in urls) {
				try {
					let data = await fetchFeed(urls[j]);
					links = links.concat(urls[j]);
					// console.log(urls[j] + ' is rss');
				} catch(err) {
					// console.log(err);
					// console.log(urls[j] + ' is not rss');
				}
			}
			console.log(links);
			let data = new Sources({
				source,
				links
			});
			try {
				await data.save();
				console.log('Saved ' + source);
			} catch(err) {
				console.log(err);
			}
    }
  }).catch(err => { throw err });
};

crawl();
