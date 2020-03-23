const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  Airport,
  Airline,
  Passenger,
  Flight,
  Employee,
  Ticket,
  Route
} = require('../models/models')

router.get('/', (req, res) => {
  res.render('index');
})

router.get('/login', (req,res) =>{
  res.render('login')
})

router.post('/login', passport.authenticate('local',{
  successRedirect: "/",
  failureRedirect: "/login",
}), (req, res) => {
  
});

router.get('/signup', (req, res)=>{
  res.render('signup')
})

router.post('/signup', (req, res) => {
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

router.get('/search-flight', (req, res) => {
  res.render('search-flight', {
    message: 'Choose a source and destination',
    flight: null
  })
})

router.post('/search-flight', (req, res) => {
  let fromCity = req.body.from.trim()
  let toCity = req.body.to.trim();
  Flight.findOne({
      source: fromCity,
      destination: toCity
    })
    .populate('airCode')
    .populate('routeNo')
    .exec((err, flight) => {
      res.render('search-flight', {
        message: 'Found the following flights',
        flight: {
          id: flight._id,
          source: flight.source,
          destination: flight.destination,
          airline: flight.airCode.name,
          departureTime: flight.routeNo.departureTime,
          arrivalTime: flight.routeNo.arrivalTime
        }
      })
    })
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

function displayLoginMessage(req, res, next){
  if(req.isAuthenticated()){
    req.flash("success", "Welcome aboard, " + User.username + "!");
    return next();
  }
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

module.exports = router;