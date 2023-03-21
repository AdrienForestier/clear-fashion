const {connectToDatabase}=require('./cluster_connection')

async function main(){
    const db = await connectToDatabase();
    const collection = db.collection('products');

    console.log('All CircleSportsWear scraped products :');
    const brand = 'CircleSportsWear';
    const productsBrand = await collection.find({brand}).toArray();
    console.log(productsBrand);

    console.log('All the products with a scraping date inferior to 2 weeks : ');
    const productsScrapedDate = await collection.find({date:{$lt:(Date.now()-12096e5)}}).toArray();
    console.log(productsScrapedDate);

    console.log('All the products that cost less than 80€ :')
    const productsCheap = await collection.find({price:{$lt:80}}).toArray();
    console.log(productsCheap);

    console.log('All the products sorted by price :')
    const productsSortedPrice = await collection.find({}).sort({price:1}).toArray();
    console.log(productsSortedPrice);

    console.log('All the products sorted by date :')
    const productsSortedDate = await collection.find({}).sort({date:1}).toArray();
    console.log(productsSortedDate);
    process.exit(0)
}

main()
