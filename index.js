const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())

//root api
app.get('/', async (req, res) => {
    res.send('My Car Paradise is running.')
})
app.listen(port, async (req, res) => {
    console.log('Listening to port:', port)
})