const {MongoClient} = require('mongodb');
const MONGODB_URI = process.env.DATABASE_URL;
const MONGODB_DB_NAME = 'PW4';

async function connectToDatabase(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    return db;
}
module.exports={connectToDatabase}

