const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;


// middleware use
app.use(cors());
app.use(express.json())

// mongo start 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qujhgtx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const coffeeDBcollection = client.db('coffeeDBcollection').collection("coffeeDBcollection");

        app.get('/coffee', async (req, res) => {
            const user = coffeeDBcollection.find()
            const result = await user.toArray()
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeeDBcollection.findOne(query);
            res.send(result)
        })



        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeDBcollection.insertOne(newCoffee);
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await coffeeDBcollection.deleteOne(query)
            res.send(result)
        })

        app.put('/coffee/:id', async(req, res)=>{
            const id =req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const updateCOffee = req.body;
            const coffee = {
               $set:{
                 name: updateCOffee.name,
                 price : updateCOffee.price,
                 details : updateCOffee.details,
                 photo : updateCOffee.photo,
               }
            }
            const result = await coffeeDBcollection.updateOne(filter, coffee, options);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// mongo end 


app.get('/', (req, res) => {
    res.send('Server is running')
})


app.listen(port, () => {
    console.log('server is running');
})