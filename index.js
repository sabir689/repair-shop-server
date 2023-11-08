const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.port || 5000;
// middleware
app.use(cors())
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyyi68r.mongodb.net/?retryWrites=true&w=majority`;

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

    const serviceCollection = client.db('RepairCafe').collection('services');
    const addedCollection = client.db('RepairCafe').collection('added');
    const bookingCollection = client.db('RepairCafe').collection('bookings');
    // services
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await serviceCollection.findOne(query);
      res.send(result);
    })
      // added section

      app.get('/added', async (req, res) => {
        const cursor = addedCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })
      app.put('/added/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedAdded = req.body;
      const added = {
        $set: {
          pictureUrl: updatedAdded.pictureUrl,
          serviceArea: updatedAdded.serviceArea,
          name: updatedAdded.name,
          serviceName: updatedAdded.serviceName,
          price: updatedAdded.price,
          description: updatedAdded.description,
        }
      };
      
      const result = await addedCollection.updateOne(filter, added, options);
      res.send(result);
    });
    app.get('/added/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addedCollection.findOne(query);
      res.send(result);

    })
    app.post('/added', async (req, res) => {
      const newAdded = req.body;
      console.log(newAdded);
      const result = await addedCollection.insertOne(newAdded)
      res.send(result)
    })
    app.delete('/added/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addedCollection.deleteOne(query);
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
  res.send('service is starting')
})

app.listen(port, () => {
  console.log(`all things are in ${port}`)
})