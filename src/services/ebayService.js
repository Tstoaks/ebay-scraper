import RssParser from "rss-parser";
import request from "request";

ngapp.service('ebayService', function (dbService, presetService) {
    let service = this;
    let rssParser = new RssParser();
    let ebayScrapeDelay = 250;
    let itemDescUrlPrefix = 'https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=';

    service.getPageItems = async function (searchTerm, pageNumber) {
        searchTerm = searchTerm.replace(' ', '+');
        console.log(`Getting search results from page: ${pageNumber}`);
        let url = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${searchTerm}&_sacat=0&_rss=1&_pgn=${pageNumber}`;
        let feed = await rssParser.parseURL(url);
        let items = [];
        feed.items.forEach(item => {
            let {title, pubDate, link} = item;
            pubDate = pubDate.substr(0, pubDate.indexOf(' ', 14));
            let splitUrl = item.link.split('/');
            let indexOfQMark = splitUrl[5].indexOf('?');
            let itemID = splitUrl[5].slice(0, indexOfQMark);
            if (items.some((item) => itemID === item.itemID)) return;
            items.push({link, itemID, pubDate, title});
        });
        return items;
    };

    service.search = async function ({presetName, numPages}) {
        let preset = presetService.getPreset(presetName);
        let items = [];
        for (let page = 1; page <= numPages; page++) {
            console.log(preset);
            let pageItems = await service.getPageItems(preset.searchTerm, page);
            for (let i = 0; i < pageItems.length; i++) {
                let item = pageItems[i];
                if (items.some((item2) => item.itemID === item2.itemID)) continue;

                await service.getItemDescription(item);
                if (service.trackKeywords(item, preset.keywords)) {
                    items.push(item);
                    service.onResultsFound(1);
                }
            }
        }
        return items;
    };

    service.getItemDescription = function (item) {
        let itemID = item.itemID;
        let descriptionUrl = itemDescUrlPrefix + itemID;

        return new Promise((resolve, reject) => {
            dbService.getEbayListing(itemID).then(function (description) {
                item.description = description.toLowerCase();
                resolve();
            }, function () {
                setTimeout(function () {
                    request(descriptionUrl, (err, res, body) => {
                        if (err) return reject(new Error(err));
                        let parser = new DOMParser();
                        let htmlDoc = parser.parseFromString(body, 'text/html');
                        let descriptionDiv = htmlDoc.getElementById('ds_div');
                        let text = descriptionDiv ? service.getVisibleText(descriptionDiv) : '';
                        item.description = text.toLowerCase();
                        dbService.addEbayListing(item).then(resolve, reject);
                    });
                }, ebayScrapeDelay);
            });
        });
    };

    service.checkIfVisible = function (childNode) {
        let ELEMENT_NODE = 1;

        if (childNode.nodeType !== ELEMENT_NODE) return false;
        if (childNode.tagName === 'STYLE') return false;
        let style = window.getComputedStyle(childNode);
        return (style.display !== 'none');
    };

    service.getVisibleText = function (htmlElement) {
        let textContent = [];
        let TEXT_NODE = 3;
        let children = htmlElement.childNodes;

        for (let i = 0; i < children.length; i++) {
            let childNode = children[i];

            if (childNode.nodeType === TEXT_NODE) {
                let text = childNode.textContent;
                if (text.trim().length > 0) {
                    textContent.push(text);
                }
            } else if (service.checkIfVisible(childNode)) {
                textContent.push(service.getVisibleText(childNode));
            }
        }
        return textContent.join('\n');
    };

    service.changeDate = function (pubDate) {
        pubDate.substr(0, pubDate.indexOf('2019'))
    };

    service.trackKeywords = function (item, keywords) {
        let matched = false;
        item.foundKeywords = [];

        keywords.forEach(function (keyword) {
            let keywordFound = item.description.includes(keyword);
            matched = matched || keywordFound;
            if (keywordFound) {
                item.foundKeywords.push(keyword);
            }
        });
        item.foundKeywords = item.foundKeywords.join(', ');
        return matched;
    };
});
