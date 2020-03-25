const express = require('express');
const passport = require('passport');
const moment = require('moment');
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
    date: '',
    flights: [{
      source: null,
      destination: null
    }]
  })
})

router.post('/search-flight', (req, res) => {
  let fromCity = req.body.from.trim()
  let toCity = req.body.to.trim();
  let date = req.body.date;
  let flightClass = req.body.class;
  let numberOfPassengers = req.body.number;
  let classes = ['Economy', 'Business', 'First Class'];
  let classIndex = classes.indexOf(flightClass);
  Flight.find({
      source: fromCity,
      destination: toCity
    })
    .populate('airCode')
    .populate('routeNo')
    .exec((err, flights) => {

      if (flights.length != 0) {
        flights = flights.filter((flight, i, arr) => {
          return flight.fare[classIndex] != undefined
        })
        flights.forEach((flight, i, arr) => {
          arr[i].fare = flight.fare[classIndex]
        })
      }


      if (flights.length != 0) {
        res.render('search-flight', {
          message: 'Found the following flights',
          date: date,
          number: numberOfPassengers,
          flightClass: flightClass,
          flights: flights
        })
      } else {
        res.render('search-flight', {
          message: 'Sorry! No flights found for your route or class. Try changing the options and search again.',
          date: date,
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
  let flight = req.body.flight;
  res.cookie('flight', flight);
  let date = req.body.date;
  res.cookie('date', date);
  let flightClass = req.body.flightClass
  res.cookie('flightClass', flightClass)
  let noOfPassenger = req.body.number;
  res.cookie('passengerNo', noOfPassenger);
  res.render('book-flight', {
    user: req.user || {},
    number: req.body.number,
    date: moment(date, 'DD/M/YYYY').format('dddd, MMMM Do YYYY'),
    flightClass: req.body.flightClass,
    flight: JSON.parse(req.body.flight)
  })

})


router.post('/book-flight/new', (req, res) => {
  let flightDetail = JSON.parse(req.cookies.flight);
  let numberOfPassengers = req.cookies.passengerNo;
  let flightClass = req.cookies.flightClass;
  let date = req.cookies.date;
  date = date.split('/')

  function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let createdTickets = []
  let flightID = flightDetail._id;
  let departureTime = flightDetail.routeNo.departureTime;
  for (let i = 1; i <= numberOfPassengers; i++) {
    let passengerName = req.body[`fullname${i}`];
    let passengerContact = req.body[`contact${i}`];
    let passengerGender = req.body[`gender${i}`];
    let passengerEmail = req.body[`email${i}`];
    let pnrNo = makeid(6);

    let PassengerDetails = {
      passengerName: passengerName,
      passengerContact: passengerContact,
      passengerGender: passengerGender,
      passengerEmail: passengerEmail
    }

    let newTicket = {
      pnrNo: pnrNo,
      fare: flightDetail.fare[0],
      class: flightClass,
      date: new Date(date[2], date[1], date[0], departureTime.slice(0, 2), departureTime.slice(3), 00),
      departureTime: departureTime,
      arrivalTime: flightDetail.routeNo.arrivalTime,
      flightNo: flightID,
      passengerDetails: PassengerDetails
    }
    Ticket.create(newTicket, function(err, createdTicket) {
      if (err) {
        console.log(err);
      } else {
        createdTickets.push(createdTicket.toObject())
        if (i == numberOfPassengers) {
          console.log(createdTickets);
          res.render('booking-confirmed',{ticket: createdTickets});
        }
      }
    })
  }
})

router.get('/delete', (req, res) => {
  Ticket.deleteMany({}, function(err, result){
    if(err){
      console.log(err)
    } else {
      console.log(result)
    }
  })
});


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