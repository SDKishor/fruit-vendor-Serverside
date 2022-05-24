const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("running fruits vendor server");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ojwr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const fruitscollection = client.db("fruitsVendor").collection("fruits");

    app.get("/fruits", async (req, res) => {
      const query = {};
      const cursor = fruitscollection.find(query);
      const fruits = await cursor.toArray();

      res.send(fruits);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const fruit = await fruitscollection.findOne(query);

      res.send(fruit);
    });

    app.get("/email/:emaildata", async (req, res) => {
      const id = req.params.emaildata;
      const query = { email: id };
      console.log(query);
      const cursor = fruitscollection.find(query);
      const rasult = await cursor.toArray();

      res.send(rasult);
    });

    //post method

    app.post("/additems", async (req, res) => {
      const doc = req.body;
      const result = await fruitscollection.insertOne(doc);
      res.send(result);
    });

    //put method
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedInfo.quantity,
        },
      };

      const result = await fruitscollection.updateOne(
        filter,
        updatedDoc,
        option
      );

      res.send(result);
    });

    //DELETE
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitscollection.deleteOne(query);

      app.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening to port " + port);
});
