var express = require('express');
var _ = require('lodash');
var app = express();
var allData = require('./data/AllCards.json');

app.use(express.static('.')); // important that this comes after rewrite middleware

var port = process.env.PORT || 3002;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!!!' });   
});

router.get('/stats', function(req, res) {
  var i = 0;
  for (var key in allData) {
    i++;
  }
  res.json({ total: i });   
});

router.get('/cards', function(req, res) {
  var validColors = ['White','Blue','Green','Red','Black'];
  var filteredCards = [];
  var color = req.query.color;
  var type = req.query.type;

  // Card Color
  if (color) {
    if (validColors.indexOf(color) === -1) {
      return res.end('Invalid color');
    }
    filteredCards = _.filter(allData, c => 'colors' in c && c.colors.indexOf(color) !== -1);
  }
  
  // Card Type
  if (type) {
    filteredCards = _.filter(allData, c => 'types' in c && c.types.indexOf(type) !== -1);
  }

  res.json({ color: color, type: type, count: filteredCards.length, data: filteredCards });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

var server = app.listen(port, function () {
  var address = server.address();
  var host = address.address;
  var port = address.port;

  console.log('App listening at http://%s:%s', host, port);
});

