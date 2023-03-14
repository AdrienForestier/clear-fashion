const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require("fs");

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  const brand = 'Dedicatedbrand';
  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      const date = new Date()
      return {name, price, brand, date};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */

module.exports.scrape = async url  => {
  try {
    const response = await fetch(url);

    if (response.ok) {
        const body = await response.text();
        const parsedData=parse(body);
        const toJson=JSON.stringify(parsedData);
        fs.writeFileSync('dedicatedbrand.json', toJson, (err)=>{
            if(err) throw err;
        })
      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
