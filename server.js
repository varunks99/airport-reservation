const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uri = "mongodb+srv://user:iamauser@airport-wonyq.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
let app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const {Airport, Airline, Passenger, Flight, Ticket} = require('./models/index');

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
