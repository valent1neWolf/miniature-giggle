//jshint esversion:6
require('dotenv').config();   //ennek a kód elején kell lennie
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

const mongoURL = 'mongodb://0.0.0.0:27017/userDB';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function (req,res) {
  res.render("home");  
});

app.get("/login",function (req,res) {
    res.render("login");  
  });

app.get("/register",function (req,res) {
  res.render("register");  
});

app.get("/secrets",function (req,res) {
  if (req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.redirect("login");
  }
});

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post("/register",function (req,res) {
  User.register({username: req.body.username}, req.body.password)   //a passport-local-mongoose segítségével lerövidíti a kódot
  .then(function (user) {
    passport.authenticate("local")(req,res,function () {    //ugyan az,mint a post login-nál
      res.redirect("/secrets");
    })
  })
  .catch(function (err) {
    console.log(err);
    res.render("/register")
  });
  });

app.post("/login",function (req,res) {
  const user =new User({
    username:req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {   //it kénytelenek vagyunk call-back function-t használni, különben hibát dob
    if (err) {
        console.log(err);
        req.redirect("/login");
    } else {
        passport.authenticate("local", {failureRedirect: "/login"})(req, res, function() {    //egy cookiet helyez el a gépünkön,hogyha et után csak szimplán a /secretset írnánk be akkor odavinne 
            res.redirect("/secrets");
        });
    };
});
});

app.post("/submit",function (req,res) {
  res.render("submit");
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});