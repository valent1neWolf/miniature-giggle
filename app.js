//jshint esversion:6
require('dotenv').config();   //ennek a kód elején kell lennie
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');   //nem ajánlott a használata

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

const mongoURL = 'mongodb://0.0.0.0:27017/userDB';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});




const User = new mongoose.model("User",userSchema)

app.get("/",function (req,res) {
  res.render("home");  
});

app.get("/login",function (req,res) {
    res.render("login");  
  });

app.get("/register",function (req,res) {
  res.render("register");  
});
  
app.post("/register",function (req,res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save()
  .then(function(){
    res.render("secrets")

  })
  .catch(function (err) {
    console.log(err);
  }); 
  });

app.post("/login",function (req,res) {
const username = req.body.username;
const password = md5(req.body.password);
User.findOne({email: username})
.then(function (foundUser) {
  if(foundUser.password === password){
    res.render("secrets");
  }
})
.catch(function (err) {
  console.log(err);
});
});
app.get
app.post("/submit",function (req,res) {
  res.render("submit");
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});