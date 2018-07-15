var express = require('express');
var app = express();
var path = require('path');

app.use(require('./index.js')(app));
app.use(express.static(path.join(__dirname, '/public')));
app.get('/*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')) });

app.listen(process.env.PORT || 4000, () => console.log(`listening on localhost:${process.env.PORT || 4000}`));
