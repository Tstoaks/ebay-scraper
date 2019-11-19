import sqlite3 from 'sqlite3';

ngapp.service('dbService', function () {
    let service = this;

    service.connect = function () {
        return new Promise((resolve, reject) => {
            service.db = new sqlite3.Database('./ebayScraper.db', (err) => {
                if (err) return reject(new Error(err));
                service.createTables().then(resolve, reject);
                service.connected = true;
            });
        });
    };

    service.createTables = function () {
        return new Promise((resolve, reject) => {
            service.db.run(
                `CREATE TABLE IF NOT EXISTS ebay_listings (
                  id INTEGER PRIMARY KEY,
                  link TEXT NOT NULL,
                  title TEXT NOT NULL,
                  pubDate TEXT NOT NULL,
                  description TEXT NOT NULL
                );`, function (err) {
                    if (err) return reject(new Error(err));
                    resolve();
                }
            );
        });
    };

    service.getEbayListing = function (itemID) {
        return new Promise((resolve, reject) => {
            service.db.get('SELECT description FROM ebay_listings WHERE ebay_listings.id = ?', [itemID], (err, row) => {
                if (err) return reject(new Error(err));
                if (!row) return reject();
                resolve(row.description);
            });
        });
    };

    service.addEbayListing = function (item) {
        let insertQuery = `INSERT INTO ebay_listings(id, link, title, pubDate, description) VALUES(?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            service.db.run(insertQuery, [
                item.itemID, item.link, item.title,
                item.pubDate, item.description
            ], function (err) {
                if (err) return reject(new Error(err));
                resolve();
            });
        });
    };
});
