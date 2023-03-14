const {connectToDatabase}=require('./cluster_connection')
const fs = require('fs')
const path = require('path')

async function createCollection(db) {
    await db.createCollection('products');
    console.log('Collection created ...');
}

async function main() {
    const db = await connectToDatabase();
    const jsonPath1 = path.join(__dirname, '../dedicatedbrand.json');
    const jsonPath2 = path.join(__dirname, '../montlimart.json');
    const jsonPath3 = path.join(__dirname, '../circleSportsWear.json');

    const products1 = JSON.parse(fs.readFileSync(jsonPath1, 'utf8'));
    const products2 = JSON.parse(fs.readFileSync(jsonPath2, 'utf8'));
    const products3 = JSON.parse(fs.readFileSync(jsonPath3, 'utf8'));
    const products = [...products1, ...products2, ...products3];
    console.log("Loaded ...")

    const collection = db.collection('products');
    const result = collection.insertMany(products)
    console.log("Added ...")
}

main();
