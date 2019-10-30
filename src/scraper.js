const request = require('request');
let RssParser = require('rss-parser');
let rssParser = new RssParser();
let DOMParser = require('dom-parser');
let fs = require('fs');
let splitUrl;
let indexOfQMark;
let itemNumber;
let itemDescUrlPrefix = 'https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=';
let descriptionUrl;
let items = [];
let searchTerms = /\b(garage|don't know|boyfriend|roommate|storage|son|attic|left these)\b/i;
let oldUrls = JSON.parse(fs.readFileSync('searchedListings.json', 'utf8'));
let matchedUrls = [];
let newUrls = [];

let done = () => {
  oldUrls = newUrls.concat(oldUrls).reduce((newArray, item) => {
    if (newArray.some(e => e.descUrl === item.descUrl)) {
      return newArray;
    }
    newArray.push(item);
    return newArray;
  }, []);
  fs.writeFileSync('searchedListings.json', JSON.stringify(oldUrls));
};

let getPageItems = async (searchTerm, pageNum) => {
  console.log(`Getting search results from page: ${pageNum}`);
  let feed = await rssParser.parseURL(`https://www.ebay.com/sch/i.html?_from=R40&_nkw=${searchTerm}&_sacat=0&_rss=1&_pgn=${pageNum}`);
  feed.items.forEach(item => {
    splitUrl = item.link.split('/');
    indexOfQMark = splitUrl[5].indexOf('?');
    itemNumber = splitUrl[5].slice(0, indexOfQMark);
    items.push(itemNumber);
  });
};

/*
  (async () => {
  for (let i = 1; i <= 15; i++) {
    await getPageItems(i);
  }
  timeout();
})();
*/

let timeout = () => {
  if (items.length === 0) return done();
  let itemNumber = items.pop();
  let needTimeout = findItemDescription(itemNumber);
  if (needTimeout) {
    setTimeout(timeout, 500);
  } else {
    timeout();
  }
};

let findItemDescription = (num) => {
  descriptionUrl = itemDescUrlPrefix + num;
  if (oldUrls.find(e => descriptionUrl === e.descUrl)) {
    matchedUrls.push(descriptionUrl);
    return false;
  }
  searchDesc(descriptionUrl);
  return true;
};

let searchDesc = (descUrl) => {
  console.log(`Getting description from ${descUrl}`);
  request(descUrl, (err, res, body) => {
    if (err) return console.error(err);
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(body, 'text/html');
    let text = htmlDoc.getElementById('ds_div').textContent;
    let foundSearchTerm = text.match(searchTerms);
    let keyword = foundSearchTerm ? foundSearchTerm[0].toLocaleLowerCase() : undefined;
    newUrls.push({descUrl, keyword});
  });
};

module.exports = getPageItems;
