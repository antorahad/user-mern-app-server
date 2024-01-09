const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors());
app.use(express.json());

//Mongo db
const uri = "mongodb+srv://gneahad:gneahadsarker094@cluster0.s9c9pgn.mongodb.net/?retryWrites=true&w=majority";

// const uri = "mongodb://localhost:27017";

// Create a MongoClient
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const userCollection = client.db("usersDB").collection("users");

    // Get Method
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Get Method 
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    // Post Method
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log("new user: ", user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.put('/users/:id', async(req, res) => {
      const id = req.params.id
      const user = req.body
      console.log(id, user)
      const filter = { _id: new ObjectId(id)};
      const options = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await userCollection.updateOne(filter, updateUser, options);
      res.send(result)
    })

    // Delete Method
    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id
      console.log('Delete from database', id)
      const query = { _id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDB().catch(console.error);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
