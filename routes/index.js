const express = require('express');
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
})

router.get('/search-flight', (req, res) => {
  res.render('search-flight', {
    message: 'Choose a source and destination',
    flight: {
      source: null,
      destination: null
    }
  })
})

router.post('/search-flight', (req, res) => {
  let fromCity = req.body.from.trim()
  let toCity = req.body.to.trim();
  Flight.find({
      source: fromCity,
      destination: toCity
    })
    .populate('airCode')
    .populate('routeNo')
    .exec((err, flights) => {
      if (flights) {
        res.render('search-flight', {
          message: 'Found the following flights',
          flights: flights
        })
      } else {
        res.render('search-flight', {
          message: `Sorry! No flights found for your route.`,
          flights: [{
            source: fromCity,
            destination: toCity
          }]
        })
      }
    })
})

module.exports = router;