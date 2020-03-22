const express = require('express');
const mongoose = require('mongoose');
const uri = "mongodb+srv://user:iamauser@airport-wonyq.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const {Airport, Airline, Passenger, Flight, Ticket} = require('./models/index')

// let newairport = new Airport({
//   name: 'Belagavi Airpot',
//   code: 'IXG',
//   location: 'Belagavi'
// });
//
// newairport.save((err, doc) => {
//   console.log(doc);
// })
