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
  var validColors = ['W','U','G','R','B','C'];
  var filteredCards = allData;
  var color = req.query.color;
  var type = req.query.type;
  var subType = req.query.subtype;
  var cmc = req.query.cmc;

  // Card Color
  if (color) {
    if (validColors.indexOf(color) === -1) {
      return res.end('Invalid color');
    }
    filteredCards = _.filter(filteredCards, c => {
      if ('colorIdentity' in c) {
        // card has a color
        return c.colorIdentity.indexOf(color) !== -1;
      } else if (color === 'C') {
        // colorless card
        return true;
      }

      return false;
    });
  }
  
  // Card Type
  if (type) {
    filteredCards = _.filter(filteredCards, c => 'types' in c && c.types.indexOf(type) !== -1);
  }

  // Card Subtype. e.g. Dragon
  if (subType) {
    filteredCards = _.filter(filteredCards, c => 'subtypes' in c && c.subtypes.indexOf(subType) !== -1);
  }

  // Converted Mana Cost
  if (cmc) {
    cmc = parseInt(cmc, 10);
    filteredCards = _.filter(filteredCards, c => 'cmc' in c && c.cmc === cmc);
  }

  res.json({
    color: color,
    type: type,
    subType: subType,
    cmc: cmc,
    count: filteredCards.length,
    data: filteredCards
  });
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

