var express = require('express');

const bodyParser = require("body-parser");
const router = express.Router();
var app = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ordering_management');   
var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function() {
  console.log("Connection Successful!");
})

var UserSchema = mongoose.Schema({
  email: String,
  password: String,
  roleId: String,
  roleName: String,
  name: String,
  company: String,
  companyId: String
});

var User = mongoose.model('User', UserSchema, User);
app.get('/', function (req, res) {
	res.end("hello node app");
});

app.post('/sign-up', function (req, res) {
  console.log(req.body.emailId);
  console.log(req.body.password);
  // a document instance
  
  User.findOne({email: req.body.email}, (err, user_res) => {
    if (err) res.json({success: false, message: 'database error'});
    // save model to database
    let user = new User({ 
      email: req.body.email,
      password: req.body.password,
      roleId: req.body.roleId,
      roleName: req.body.roleName,
      name: req.body.name,
      company: req.body.company,
      companyId: req.body.companyId 
    });
    if(user_res){
      res.json({success: false, message: 'user already exist!'});
    } else{
      user.save(function (err, user) {
        if (err) res.json({success: false, message: 'database error!'});
        console.log(user.name + " saved to user collection.");
        res.json({success: true, message: 'user saved to collection!'});
      });
    }
  });
});
app.post('/sign-in', function (req, res) {
  req.body.emailId;
  req.body.password;
  console.log(req.body.emailId);
  console.log(req.body.password);
  User.findOne({email: req.body.emailId, password: req.body.password}, (err, user_res) => {
    if (err) res.json({success: false, message: 'database error!'});
    if(user_res){
      res.json({success: true, data: user_res});
    } else{
      res.json({success: false, message: 'user not found!'});
    }
  });
});
app.get('/getCompanies', function (req, res) {
  if(req.query.roleId == '1'){
    User.find({roleId: req.query.roleId}, (err, user_res) => {
      if (err) res.json({success: false, message: 'database error!'});
      if(user_res){
        res.json({success: true, data: user_res});
      } else{
        res.json({success: false, message: 'user not found!'});
      }
    });
  } else{
    User.find({roleId: req.query.roleId, companyId: req.query.companyId}, (err, user_res) => {
      if (err) res.json({success: false, message: 'database error!'});
      if(user_res){
        res.json({success: true, data: user_res});
      } else{
        res.json({success: false, message: 'user not found!'});
      }
    });
  }
});
app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

// add router in the Express app.
app.use("/", router);