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
    secret: 'SECRET_KEY',
    algorithms: ['HS256']
});

const Users = [
    {name: 'dany', password: 'password', email: 'dany@test.com', desc: ''},
    {name: 'Joseph', password: 'password', email: 'joseph@test.com', desc: ''}
];

app.post('/login', (req, res) => {

    if (req.body.name === '') {
        return res.send('Username must not be empty');
    }
    if (req.body.email === '') {
        return res.send('Email must not be empty');
    } else {
        const regExEmail = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!req.body.email.match(regExEmail)) {
            return res.send('Email must be a valid email address');
        }
    }
    if (req.body.password === '') {
        return res.send('Password must not empty');
    } else {
        const regExPass = /[a-zA-Z0-9]{8,}/;
        if (!req.body.password.match(regExPass)) {
            return res.send('Your password must have at least 8 characters');
        }
    }


    let User = Users.find((u) => {
        return u.name === req.body.name && u.password === req.body.password;
    })

    if (!User) {
        return res.send('No user found');
    }

    let token = jwt.sign({
        name: User.name
    }, 'SECRET_KEY', {expiresIn: '12 hours'});

    res.json({access_token: token});
})

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
        console.log('connected to MongoDB');
        let db = client.db('TIL');
        getUsers(db, (documentsReturned) => {
            console.log(documentsReturned);
            res.json(documentsReturned);
        })
    })
})

app.get('/posts', async (req, res) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        console.log('connected to MongoDB');
        let db = client.db('TIL');
        getPosts(db, (documentsReturned) => {
            console.log(documentsReturned);
            res.json(documentsReturned);
        })
    })
})

app.post('/users', jwtCheck, (req, res) => {
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