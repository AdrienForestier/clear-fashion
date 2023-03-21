const {MongoClient} = require('mongodb');
const MONGODB_URI = "mongodb+srv://adrien:SLiJgmdNMk91c250@pw4.auwtwqc.mongodb.net/?retryWrites=true&writeConcern=majority"
//const MONGODB_URI = process.env.DATABASE_URL;
// **Had to do it without the environment variable because deployment didn't work with it**
const MONGODB_DB_NAME = 'PW4';

async function connectToDatabase(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    return db;
}
module.exports={connectToDatabase}

