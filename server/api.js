const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {ObjectId} = require('mongodb');
const {connectToDatabase}=require('./database/cluster_connection');

const PORT = 8092;
const app = express();
app.use(express.json())
module.exports = app;
app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());
app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);

async function start() {
  app.get('/', (request, response) => {
    response.send({'ack': true});
  });

  app.get('/products/:id_toFind', async (req, res) => {
    try {
      const {id_toFind} = req.params;
      const product = await collection.findOne({_id: ObjectId(id_toFind)});
      res.send(product);
    } catch (err) {
      console.error(err.message);
    }
  })
}

async function start2(){
  const db = await connectToDatabase();
  const collections = db.collection('products');
  app.get('/products/search', async(req, res)=>{
    try {
      const lim = req.query.limit;
      const price = req.query.price;
      const brand = req.query.brand;
      const query={};
      if(brand!==""){query.brand=brand;}
      if (price!==""){query.price={$lte:parseInt(price)};}
      const products = await collections.find(query).limit(parseInt(lim)).toArray();
      res.send(products);
    }
    catch(err){
      console.error(err.message);
    }
  })
}
start2();
