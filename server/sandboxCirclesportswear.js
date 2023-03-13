/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/circlesportswear');

async function sandbox (eshop = 'https://shop.circlesportswear.com/') {
    try {
        console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

        const products = await dedicatedbrand.scrape(eshop);

        console.log(products);
        console.log('done');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

const [,, eshop] = process.argv;

sandbox(eshop);