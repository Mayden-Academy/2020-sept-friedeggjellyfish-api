const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const port = 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const url = "mongodb://root:password@localhost:27017";

const jwtCheck = expressjwt({
    secret: 'secretkey',
    algorithms: ['HS256']
});

// mongoose.connect('mongodb://localhost:27017', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });


let getUsers = (db, callback) => {
    let collection = db.collection('users');
    collection.find({}).toArray((error, docs) => {
        console.log('displaying users');
        callback(docs);
    })
}

let getPosts = (db, callback) => {
    let collection = db.collection('posts');
    collection.find({}).toArray((error, docs) => {
        console.log('displaying users');
        callback(docs);
    })
}

let addUser = (db, newUser) => {
    let collection = db.collection('users');
    collection.insertOne(newUser);
}

app.get('/users', async (req, res) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        console.log('yes, you are connected');
        let db = client.db('TIL');
        getUsers(db, (documentsReturned) => {
            console.log(documentsReturned);
            res.json(documentsReturned);
        })
    })
})

app.get('/posts', async (req, res) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        console.log('yes, you are connected');
        let db = client.db('TIL');
        getPosts(db, (documentsReturned) => {
            console.log(documentsReturned);
            res.json(documentsReturned);
        })
    })
})

app.post('/users', (req, res) => {
    let newName = req.body.name;
    let newEmail = req.body.email;
    let newPassword = req.body.password;
    let newDesc = req.body.description;

    let newUser = {
        name: newName,
        email: newEmail,
        password: newPassword,
        description: newDesc
    }
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        console.log('connected to Mongo');
        let db = client.db('TIL');
        addUser(db, newUser);
    });
    res.json('Welcome to TIL community');
})






app.listen(port, () => {console.log(`Listening on http://localhost:${port}`)})