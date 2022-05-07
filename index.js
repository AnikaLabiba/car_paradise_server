const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())

function varifyJWT(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        console.log('decoded', decoded);
        req.decoded = decoded
        next()
    })
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z240d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
''
async function run() {
    try {
        await client.connect()
        const carsCollection = client.db("car-paradise").collection("car");
        const ordersCollection = client.db("car-paradise").collection("order");

        //auth and creating jwt
        app.post('/login', async (req, res) => {
            const user = req.body
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken })
        })

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

        //updating car quantity
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCar = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedCar.quantity,

                }
            };
            const result = await carsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        //post order to db
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })

        //getting orders by fillering email
        app.get('/order', varifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.query.email
            if (email === decodedEmail) {
                const query = { email: email }
                const cursor = ordersCollection.find(query)
                const result = await cursor.toArray()
                res.send(result)
            }
        })

        //cancel order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
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