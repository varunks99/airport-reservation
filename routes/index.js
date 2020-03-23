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
module.exports = router;