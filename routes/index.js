const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  Airport,
  Airline,
  Passenger,
  Flight,
  Employee,
  Ticket,
  Route
} = require('../models/models')
var app = express();


router.get('/', (req, res) => {
  res.render('index')
  if (req.user)
    req.flash("success", "Welcome aboard, " + req.user.username + "!");
})


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', displayLoginMessage, passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
}), (req, res) => {
  console.log(req.user);
});

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {
  Passenger.register(new Passenger({
    username: req.body.username
  }), req.body.password, function(err, User) {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome aboard, " + req.user.username + "!");
        res.redirect("/")
      })
      Passenger.findOne({
        username: req.body.username
      }, function(err, User) {
        if (err) {
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
    number: 1,
    class: '',
    flights: [{
      source: null,
      destination: null
    }]
  })
})

router.post('/search-flight', (req, res) => {
  let fromCity = req.body.from.trim()
  let toCity = req.body.to.trim();
  let flightClass = req.body.class;
  let numberOfPassengers = req.body.number;
  let classes = ['Economy', 'Business', 'First Class'];
  Flight.find({
      source: fromCity,
      destination: toCity
    })
    .populate('airCode')
    .populate('routeNo')
    .exec((err, flights) => {

      if (flights.length != 0)
        flights = flights.filter((flight, i, arr) => {
          return flight.fare[classes.indexOf(flightClass)] != undefined
        })

      if (flights.length != 0) {
        res.render('search-flight', {
          message: 'Found the following flights',
          number: numberOfPassengers,
          flightClass: flightClass,
          flights: flights
        })
      } else {
        res.render('search-flight', {
          message: 'Sorry! No flights found for your route or class. Try changing the options and search again.',
          number: numberOfPassengers,
          class: flightClass,
          flights: [{
            source: fromCity,
            destination: toCity
          }]
        })
      }
    })
})



router.post('/book-flight', (req, res) => {
  var flight = req.body.flight;
  res.cookie("flight", flight);
  var flightClass = req.body.flightClass
  res.cookie("flightClass", flightClass)
  var noOfPassenger = req.body.number;
  res.cookie("passengerNo", noOfPassenger);
  res.render('book-flight', {
    user: req.user || {},
    number: req.body.number,
    flightClass: req.body.flightClass,
    flight: JSON.parse(req.body.flight)
  })

})

router.post('/book-flight/new', (req, res) => {
  var flightDetail = JSON.parse(req.cookies.flight);
  var numberOfPassengers = req.cookies.passengerNo;
  console.log(numberOfPassengers);
  var flightClass = req.cookies.flightClass;
  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 var createdTickets = [{}]
 var flightID = flightDetail._id;
  for(var i = 1; i<=numberOfPassengers; i++){
  var passengerName = req.body[`fullname${i}`];
  var passengerContact = req.body[`contact${i}`];
  var passengerGender = req.body[`gender${i}`];
  var passengerEmail = req.body[`email${i}`];
  var pnrNo = makeid(6);
  var PassengerDetails = {
    passengerName: passengerName,
    passengerContact: passengerContact,
    passengerGender: passengerGender,
    passengerEmail: passengerEmail
    }
    var newTicket = {pnrNo: pnrNo, fare: flightDetail.fare[0], class: flightClass, date: Date.now(), flightNo: flightID, passengerDetails: PassengerDetails}
    Ticket.create(newTicket, function(err, createdTicket){
      if(err) {
        console.log(err);
      } else {
        var tickett = createdTicket.toJSON();
        app.set('CreatedTicket', tickett);
      }
    })
    var ticket = app.get('CreatedTicket');
    console.log(ticket)
    createdTickets.push(ticket);
    res.send(ticket)
  }
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

function displayLoginMessage(req, res, next) {
    req.flash("success", "Successfully logged !");
    return next();
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;