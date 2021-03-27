const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config()
console.log(process.env.DB_USER);

app.use(cors());
app.use(bodyParser.json())
const user = "arabian";
const pass = "arabianHorse88";

// respond with "hello world" when a GET request is made to the homepage


// var admin = require("firebase-admin");

var serviceAccount = require("./fire-signup-e8059-firebase-adminsdk-tl3gf-232da4dcd9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esvfp.mongodb.net/burj-al-arab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("burj-al-arab").collection("bookings");
  // perform actions on the collection object
  console.log("db connect successfully");
  app.post('/addBooking', (req, res) =>{
      const newBooking = req.body;
      bookings.insertOne(newBooking)
      .then(result =>{
          res.send(result.insertedCount > 0);
          console.log(result);
      })
      console.log(newBooking);
  })
  app.get('/bookings', (req, res) =>{
      const bearer = req.headers.authorization;

      if(bearer && bearer.startsWith('Bearer')){
          const idToken = bearer.split(' ')[1];
          console.log(idToken);
          // idToken comes from the client app
        admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
        const tokenEmail = decodedToken.email;
        if(tokenEmail == req.query.email){
            bookings.find({email: req.query.email})
            .toArray((err, documents) =>{
            res.statusCode(200).send(documents);
            })
         }
        })
        .catch((error) => {
        // Handle error
        res.statusCode(401).send('Unauthorized access');
        });
      }
      else{
          res.statusCode(401).send('Unauthorized access');
      }
  })
//   client.close();
});


app.get('/', function (req, res) {
  res.send('Hello Naimur\'s own world')
})

app.listen(5000,()=>{
    console.log("port 5000 running");
})