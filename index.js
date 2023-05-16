const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser")
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const path= require('path')
const crypto = require('crypto');

let therapistIamgeName;
const multer = require('multer')
const storage = multer.diskStorage({
	destination:(req,file,call_back)=>{
		call_back(null,'images')
	},
	filename:(req,file, call_back) =>{
		console.log(file)
		therapistIamgeName= Date.now()+crypto.randomBytes(20).toString('hex')+'therapist'+path.extname(file.originalname);
		call_back(null,therapistIamgeName)
	}
})
const upload = multer({storage})


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

const uri = `mongodb+srv://${process.env.REACT_APP_MONGODB_USER}:${process.env.REACT_APP_MONGODB_PASS}@cluster0.iscr21w.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {

	try {
  
	  const database = client.db("Hope");
  
	  const numberCollection = database.collection("number");
	  const therapistCollection = database.collection("therapists");
  
	  
  
	  app.post('/number', async(req,res) =>{
		const number= req.body;
		console.log(number);
		const result = await numberCollection.insertOne(number);
		res.send(result)
		
	  })
	  app.post('/upload',upload.single('image'), async(req,res) =>{
		const therapistDetails= req.body;
		// const{image} = req.files;
		// const imagename=Date.now()+crypto.randomBytes(20).toString('hex')+'therapist'+path.extname(file.originalname)
		// console.log(number);
		const result = await therapistCollection.insertOne({
			therapistDetails,
			therapistIamgeName
		});
		res.send(therapistIamgeName);
		
	  })

	  app.get('/number', async(req,res) =>{
		const query= {};
		const cursor = numberCollection.find(query);
		const result = await cursor.toArray();
		res.send(result)
		
	  })

	  
	
  
	} finally {
  
	//   await client.close();
  
	}
  
  }
  
  run().catch(console.dir);


app.get('/', (req, res) => {
	res.send('Hello World!')
  })
  
app.listen(process.env.PORT || 5000, () => {
	console.log("Sever is listening on port 5000")
})