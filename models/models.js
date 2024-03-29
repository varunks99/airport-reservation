const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const model = mongoose.model;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');

let airportSchema = new Schema({
  name: String,
  code: String,
  location: String
})
const Airport = model('Airport', airportSchema);

let airlineSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: String,
  contact: String,
})

const Airline = model('Airline', airlineSchema);

let passengerSchema = new Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  gender: String,
  contact: String,
  bookings: [String]
})
passengerSchema.plugin(passportLocalMongoose)
const Passenger = model('Passenger', passengerSchema);

let flightSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  source: String,
  destination: String,
  fare: [Number],
  airCode: {
    type: String,
    ref: 'Airline'
  },
  routeNo: {
    type: String,
    ref: 'Route'
  }
})
const Flight = model('Flight', flightSchema);

let employeeSchema = new Schema({
  empId: String,
  name: String,
  type: String,
  airCode: {
    type: ObjectId,
    ref: 'Airline'
  }
})
const Employee = model('Employee', employeeSchema);

let ticketSchema = new Schema({
  pnrNo: String,
  fare: Number,
  class: String,
  seatNo: String,
  date: Date,
  departureTime: String,
  arrivalTime: String,
  flightNo: {
    type: String,
    ref: 'Flight'
  },
  passengerDetails: {
    passengerName: String,
    passengerContact: Number,
    passengerGenger: String,
    passengerEmail: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  bookedBy: String
})
const Ticket = model('Ticket', ticketSchema);

let routeSchema = new Schema({
  _id: String,
  departureTime: String,
  arrivalTime: String
})
const Route = model('Route', routeSchema);


module.exports = {
  Airport,
  Airline,
  Passenger,
  Flight,
  Employee,
  Ticket,
  Route
}