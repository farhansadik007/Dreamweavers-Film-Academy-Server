const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6ydyu2.mongodb.net/?retryWrites=true&w=majority`;

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

        const instructorsCollection = client.db('dwDB').collection('instructors');
        const classesCollection = client.db('dwDB').collection('classes');
        const cartCollection = client.db('dwDB').collection('carts');


        //instructors
        app.get('/instructors', async(req, res) => {
            const result = await instructorsCollection.find().toArray();
            res.send(result);
        })


        //classes
        app.get('/classes', async(req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })


        //carts
        app.get('/carts', async(req, res) => {
            const email = req.query.email;
            if(!email) {
                res.send([]);
            }
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/carts', async(req, res) => {
            const item = req.body;
            const result = await cartCollection.insertOne(item);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Films are in Production');
})

app.listen(port, () => {
    console.log(`Dreamweavers is running on port: ${port}`);
})