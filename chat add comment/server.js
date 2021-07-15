// import Three npm packge  which will use in this project .
// Mogoose as database manager 
// Body parser get data from the user 

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Using port 4000  to run the server 
const port = 4000;

const application = express();
const DatabaseConnection = mongoose.connection;

// Mongo Db Altas  live database url
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
// When join the url it will fetch the all already save record 
  application .get('/chats', (req, res) => {
    var msg = mongoose.model('UserMessage', UserMessageSchema);
    msg.find({})
      .sort({time : 1})
      .exec((error, results) => 
        res.send(JSON.stringify(results))
      );
  });
  
  
  // posting chats
  // User send the name and message 

  application.post('/chats/post', (req, res) => {
    let msgObj = req.body;
    chatMsg = new UserMessage({ alias: msgObj.alias, message: msgObj.msg });
    chatMsg.save((err) => { if (err) { console.log('An error occurred.') }});
    })



  // clearing chats
  // Clear the record from database 
  // Delete all data From collection
  application.get('/clear', (req, res) => {
    DatabaseConnection.dropDatabase();
  });
  
  
  // It will redirct to the home page 
  application.all('*', (req, res) => res.redirect('/'));
  
  // Run the application at the 4000 port
  application.listen(port, () => console.log(`application listening Port ${port}`))
