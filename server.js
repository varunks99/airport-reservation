const express = require('express');
const passport = require('passport');
const {Airport, Airline, Passenger, Flight, Ticket} = require('./models/index');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const uri = "mongodb+srv://user:iamauser@airport-wonyq.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
let app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(require("express-session")({
  secret: "India is my country I love my country",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(Passenger.serializeUser());
passport.deserializeUser(Passenger.deserializeUser());
passport.use(new LocalStrategy(Passenger.authenticate()));
app.use(flash());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req,res) =>{
  res.render('login')
})

app.post('/login', passport.authenticate('local',{
  successRedirect: "/",
  failureRedirect: "/login",
}), (req, res) => {
  
});

app.get('/signup', (req, res)=>{
  res.render('signup')
})

app.post('/signup', (req, res) => {
  Passenger.register(new Passenger({username: req.body.username}), req.body.password, function(err, User){
    if(err){
      console.log(err)
      res.send(err)
    } else {
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome aboard, " + User.username + "!");
        res.redirect("/")
      })
      Passenger.findOne({username: req.body.username}, function(err, User){
        if(err){
          console.log(err)
        } else {
          User.email = req.body.email
          User.name = req.body.fullname;
          User.gender = req.body.gender;
          User.contact = req.body.contact;
          User.save();
        }
        console.log(User)
      })
    }
  })
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
