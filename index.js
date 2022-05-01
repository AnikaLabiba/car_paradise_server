const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z240d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const carsCollection = client.db("car-paradise").collection("car");

        //getting all the cars data from db
        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = carsCollection.find(query)
            const cars = await cursor.toArray()
            res.send(cars)
        })

        //get single car from db
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const carDetails = await carsCollection.findOne(query)
            res.send(carDetails)
        })

        //adding new car to the db
        app.post('/inventory', async (req, res) => {
            const newCar = req.body
            const result = await carsCollection.insertOne(newCar)
            res.send(result)
            console.log(result)
        })

        //delete single car
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await carsCollection.deleteOne(query)
            res.send(result)
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