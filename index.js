const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });
const users = ["User1", 'user2', 'user3', 'user4', 'user5', 'user6'];


app.get('/products', (req, res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("products");
        collection.find().toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
});

app.get('/orders', (req, res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("orders");
        collection.find().toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
});

app.get('/product/:key', (req, res) =>{
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("products");
        collection.find({key}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents[0]);
            }
        });
        client.close();
      });
});

app.post('/getProductsByKey', (req, res) =>{
    const key = req.params.key;
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("products");
        collection.find({key: { $in: productKeys }}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
});

//delete

//update

// post
app.post('/addProduct', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("products");
        collection.insertOne(product, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
      });
});

app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("orders");
        collection.insertOne(orderDetails, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
      });
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listening to port 4200'));