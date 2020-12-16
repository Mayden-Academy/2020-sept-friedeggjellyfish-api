const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser').json();
const port = 3001;
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');

app.use(cors({origin: '*'}));
app.options('*', cors({origin: '*'}));

mongoose.connect('mongodb://root:password@localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'TIL'
})

const jwtCheck = expressjwt({
  secret: 'secretkey',
  algorithms: ['HS256']
});

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
});

//create User blueprint/Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "What's your name"],
  },
  email: {
    type: String,
    required: [true, "What's your email"],
  },
  profile: {
    type: String,
    max: 500,
  },

  posts: postSchema,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  review: String,
});

const User = mongoose.model('user', userSchema);

//now we create a new user from the User Model/schema above

app.get('/', (req, res) => {
  Find(res);
});
// user.save();

app.post('/signup', bodyParser, (req, res) => {
  console.log('!', req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const profile = req.body.profile;
  user = new User({
    name,
    email,
    password,
    profile,
  });
  user.save();
  //res.redirect('/');
  const maxAge = 3 * 24 * 60 * 60;
  let token = jwt.sign({
    sub: user.id,
    username: user.username
  }, 'secretkey', {expiresIn: maxAge});
  res.json({access_token: token});
});

const Post = mongoose.model('post', postSchema);
const user9 = new User({
  name: 'Bing Hope',
  email: 'bing@gmail.com',
});

function InsertMany() {
  User.insertMany([user1, user2], err => {
    if (err) console.log(err);
    else {
      console.log('successfully saved all');
    }
  });
}

// How do we read from our database (find)
// use find() method - takes 2 param

function Find(res) {
  User.find((err, users) => {
    if (err) console.log(err);
    else {
      res.json(users);
      console.log(users);

      //good practice to close the db connection
      // mongoose.connection.close();

      users.forEach(user => console.log(user.name));
    }
  });
}

//updating data using updateOne()
//takes 3 params - how to find the document you want to update, what update/changes it needs , error handling function

function Update() {
  User.updateOne(
    {_id: '5fd6193a98b98a0dc884804b'},
    {name: 'king kong'},
    err => {
      if (err) console.log(err);
      else console.log('successfully updated');
    }
  );
}

// User.deleteOne({_id: '5fd61520c7f1f30d8a674f32', err => {   if (err) console.log(err);
//     else console.log('successfully updated');
//   }});

function deleteMany() {
  User.deleteMany({name: 'mary Hope'}, err => {
    if (err) console.log(err);
    else console.log('successfully deleted');
  });
}

//embedding schemas into another schema so that you can form relationships

// user9.save();

const post = new Post({
  title: 'How I learnt PHP',
  author: 'Me',
  user: user9,
});

post.save();

const userPost = new User({
  name: 'amy',
  email: 'amy@hotmail.com',
  posts: post,
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})
