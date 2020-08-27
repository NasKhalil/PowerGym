const express = require('express')
const {MongoClient, ObjectID} = require('mongodb')
const bodyParser = require('body-parser')
const assert = require('assert')
const path = require('path');


const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json())

const mongo_url = 'mongodb://localhost:27017'
const dataBase = "AcademyData"

 MongoClient.connect(mongo_url,{ useUnifiedTopology: true }, (err, client)=>{
    assert.equal(err, null, 'dataBase connexion failed')

     const db = client.db(dataBase);

    app.post('/add', (req, res) =>{
        let newExpert = req.body;
        db.collection('abonnement').insertOne(newExpert, (err, data)=>{
            if (err) res.send('Vous ne pouvez pas ajouter un nouveau abonné')
            else (res.send('Vous avez ajouter un nouveau abonné'))
        })
    })

    app.get('/abonnementList', (req, res) =>{
        db.collection('abonnement').find().toArray((err, data)=>{
            if (err) res.send('can not add new subscriber')
            else (res.send(data))
        })
    })

    app.get('/abonnementList/:id', (req, res) => {
        let expertId = ObjectID(req.params.id)
        db.collection('abonnement').findOne({_id : expertId}, (err, data)=>{
            if (err) res.send('can not add new subscriber')
            else (res.send(data))
        })
    })

    app.put('/abonnementList/:id', (req, res) => {
        let expertId = ObjectID(req.params.id)
        let updatedExpert = req.body
        db.collection('abonnement').updateOne({_id : expertId},{$set : { ...updatedExpert}}, (err, data)=>{
            if (err) console.log(err)
            else (res.send(data))
        })
    })

    app.delete('/abonnementList/:id', (req, res) => {
        let expertId = ObjectID(req.params.id)
        let updatedExpert = req.body
        db.collection('abonnement').findOneAndDelete({_id : expertId},{$set : { ...updatedExpert}}, (err, data)=>{
            if (err) console.log(err)
            else (res.send(data))
        })
    })

})



// server static assets in production
if (process.env.NODE_ENV === 'production') {
  // set static folde
//  app.use(express.static("/build"));

  app.get("/", (req, res) => {
    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });
  });
}

app.use(express.static(path.join(__dirname, "build")));


// app.get("/*", function(req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

const port = process.env.PORT || 5005;

app.listen(port, () => console.log(`server is running on port ${port}`));
