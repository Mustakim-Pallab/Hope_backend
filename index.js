const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");
const crypto = require("crypto");
app.use("/images", express.static("images"));

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, call_back) => {
    call_back(null, "images");
  },
  filename: (req, file, call_back) => {
    console.log(file);
    const therapistIamgeName =
      Date.now() +
      crypto.randomBytes(20).toString("hex") +
      path.extname(file.originalname);
    call_back(null, therapistIamgeName);
  },
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const uri = `mongodb+srv://${process.env.REACT_APP_MONGODB_USER}:${process.env.REACT_APP_MONGODB_PASS}@cluster0.iscr21w.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    const database = client.db("Hope");
    const database1 = client.db("HopeAdmin");

    const numberCollection = database.collection("number");
    const therapistCollection = database.collection("therapists");
    const servicesCollection = database.collection("services");
    const testimonyCollection = database.collection("testimonials");
    const faqCollection = database.collection("faqs");
    const faqQuestionCollection = database.collection("faqsQuestion");
    const bookReqCollection = database.collection("Requests for books");
    const adminsCollection = database1.collection("Admins");

    app.post("/number", async (req, res) => {
      const number = req.body;
      console.log(number);
      const result = await numberCollection.insertOne(number);
      res.send(result);
    });

    app.post("/therapists", upload.single("image"), async (req, res) => {
      const { name, degree, description, tags } = req.body;
      const imageName = req.file.filename;
      const result = await therapistCollection.insertOne({
        name,
        degree,
        description,
        tags,
        imageName,
      });
      res.send(result);
    });
    app.post("/services", upload.single("image"), async (req, res) => {
      const { title, description, points } = req.body;
      const imageName = req.file.filename;
      const result = await servicesCollection.insertOne({
        title,
        description,
        points,
        imageName,
      });
      res.send(result);
    });
    app.post("/testimony", upload.single("image"), async (req, res) => {
      const { testimony, author, designation } = req.body;
      const imageName = req.file.filename;
      const result = await testimonyCollection.insertOne({
        testimony,
        author,
        designation,
        imageName,
      });
      res.send(result);
    });

    app.post("/faq", async (req, res) => {
      const { question, answer } = req.body;

      const result = await faqCollection.insertOne({
        question,
        answer,
      });
      res.send(result);
    });

    app.post("/faqAsk", async (req, res) => {
      const { email, question } = req.body;

      const result = await faqQuestionCollection.insertOne({
        email,
        question,
      });
      res.send(result);
    });

    app.post("/bookReq", async (req, res) => {
      const {
        firstname,
        lastName,
        email,
        city,
        state,
        zip,
        address,
        paymentId,
      } = req.body;

      const result = await bookReqCollection.insertOne({
        firstname,
        lastName,
        email,
        city,
        state,
        zip,
        address,
        paymentId,
      });
      res.send(result);
    });

    app.post("/adminList", async (req, res) => {
      const {
        name,
		email
      } = req.body;

      const result = await adminsCollection.insertOne({
        name,
		email
      });
      res.send(result);
    });

    app.get("/number", async (req, res) => {
      const query = {};
      const cursor = numberCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/therapists", async (req, res) => {
      const query = {};
      const cursor = therapistCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/testimony", async (req, res) => {
      const query = {};
      const cursor = testimonyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/faq", async (req, res) => {
      const query = {};
      const cursor = faqCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Sever is listening on port 5000");
});
