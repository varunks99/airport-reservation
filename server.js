const express = require('express');
const passport = require('passport');
const {Airport, Airline, Passenger, Flight, Ticket} = require('./models/models');
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

let routes = require('./routes/index')

app.use('/', routes);

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
