
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = 4000;

const application = express();
const DatabaseConnection = mongoose.connection;
const mongoDBURL = 'mongodb+srv://usman:Usman123456@cluster0.kylbe.mongodb.net/user?retryWrites=true&w=majority'

application.use(bodyParser.json()); 
application.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoDBURL, { useNewUrlParser: true ,useUnifiedTopology: true});


DatabaseConnection.on('error', console.error.bind(console, 'MongoDB connection error: '));

// This is the only schema in the DB.
// It contains all of the data / metadata for one message in the chat.
var Schema = mongoose.Schema;

var UserMessageSchema = new Schema({
  
  time: { 
    type: Date, 
    default: Date.now
   },
   alias: String,
   message: String
});


var UserMessage = mongoose.model('UserMessage', UserMessageSchema );


application.use(express.static('public_html'));
  


// fetching chats 
  application .get('/chats', (req, res) => {
    var msg = mongoose.model('UserMessage', UserMessageSchema);
    msg.find({})
      .sort({time : 1})
      .exec((error, results) => 
        res.send(JSON.stringify(results))
      );
  });
  
  
  // posting chats
  application.post('/chats/post', (req, res) => {
    let msgObj = req.body;
    chatMsg = new UserMessage({ alias: msgObj.alias, message: msgObj.msg });
    chatMsg.save((err) => { if (err) { console.log('An error occurred.') }});
    })



  // clearing chats
  application.get('/clear', (req, res) => {
    DatabaseConnection.dropDatabase();
  });
  
  
  application.all('*', (req, res) => res.redirect('/'));
  
  
  application.listen(port, () => console.log(`application listening Port ${port}`))
