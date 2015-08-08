"use strict";

const fs = require('fs');
const cheerio = require('cheerio');

module.exports = function(filename, callback) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      return callback(err);
    }
    let $ = cheerio.load(data.toString(), {xmlMode: true});
    let collect = function(index, elem) {
      return $(elem).text();
    };

    callback(null, {
      _id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
      title: $('dcterms\\:title').text(),
      authors: $('pgterms\\:agent pgterms\\:name').map(collect).toArray(),
      subjects: $('[rdf\\:resource$="/LCSH"]').siblings(' rdf\\:value').map(collect).toArray()
    });
  });
};
