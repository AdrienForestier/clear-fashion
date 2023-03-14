const {connectToDatabase}=require('./cluster_connection')

async function createCollection(db) {
    await db.createCollection('my_collection');
    console.log('Collection created');
}

async function main() {
    const db = await connectToDatabase();
    const collections = await db.listCollections({ name: 'my_collection' }).toArray();
    if (collections.length === 0) {
        await createCollection(db);
    }
}

main();
