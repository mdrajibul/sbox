const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
// Initialise Express
const app = express();
// Render static files

app.use('/public', express.static(__dirname + '/public'));
app.use('/sbox', express.static(__dirname + '/node_modules/@mdrajibul/sbox/dist')); // redirect JS bootstrap
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jquery


// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);

// *** GET Routes - display pages ***
// Root Route
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/api/country', function(req, res) {

    const data = fs.readFileSync('./public/country.json');
    const elements = JSON.parse(data);

    res.send(elements);
});