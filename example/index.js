const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const options = {
    key: fs.readFileSync('./ssl/rootca.key'),
    cert: fs.readFileSync('./ssl/rootca.crt')
};

const app = express();

app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));
app.engine('html', require('ejs').renderFile);

const router = require('./router/route')(app);

app.use(express.static(path.join(__dirname, '/js')));
app.use(express.static(path.join(__dirname, '/img')));

// const server = app.listen(app.get('port'), () => {
//     console.log(app.get('port'), 'is open 😀');
// });

http.createServer(app).listen(app.get('port'), () => {
    console.log(app.get('port'), 'is open 😀');
})
// https.createServer(options, app).listen(app.get('port'));