const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())


//carParadiseUser
//cKUVSaXjf4hh8WIs



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z240d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const carsCollection = client.db("car-paradise").collection("car");

        //getting all the cars data from db
        app.get('/cars', async (req, res) => {
            const query = {}
            const cursor = carsCollection.find(query)
            const cars = await cursor.toArray()
            res.send(cars)
        })
    }
    finally {

    }
}
run().catch(console.dir)

//root api
app.get('/', async (req, res) => {
    res.send('My Car Paradise is running.')
})
app.listen(port, async (req, res) => {
    console.log('Listening to port:', port)
})