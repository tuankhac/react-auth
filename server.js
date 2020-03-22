/*
lib
*/
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const session = require("express-session");
/*
custom lib
*/
const withAuth = require('./middleware');
const User = require('./models/User');
const Common = require('./models/Common');

// Load modules
// const PoolManager = require('mysql-connection-pool-manager');

const options = {
  idleCheckInterval: 1000,
  maxConnextionTimeout: 30000,
  idlePoolTimeout: 3000,
  errorLimit: 5,
  preInitDelay: 50,
  sessionTimeout: 1800000,
  onConnectionAcquire: () => { console.log("Acquire"); },
  onConnectionConnect: () => { console.log("Connect"); },
  onConnectionEnqueue: () => { console.log("Enqueue"); },
  onConnectionRelease: () => { console.log("Release"); },
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reactmysql',
  port: '3306',
  // socketPath: '/var/run/mysqld/mysqld.sock',
  charset: 'utf8mb4',
  multipleStatements: true,
  connectTimeout: 1800000,
  acquireTimeout: 1800000,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 500,
  debug: false
}

// Initialising the instance
// const mySQL = PoolManager(options);
const pool = mysql.createPool(options);

/*
declare
*/
const secret = 'mysecret';
// Set up a whitelist and check against it:
var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Then use it before your routes are set up:
// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser("mysecret"));
app.use(
  session({
    secret: process.env.LOGIN_SERVER_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'reactmysql'
// });

// connection.connect(function (err) {
//   (err) ? console.log(err) : console.log(connection);
// });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/home', function (req, res) {
  res.send('Welcome!');
});

app.get('/api/news', (req, res) => {
  var sql = "SELECT * FROM news ORDER BY id DESC";
  connection.query(sql, function (err, results) {
    if (err) throw err;
    res.json({ news: results });
  });
});

app.get('/api/news2', (req, res) => {
  var sql = "SELECT * FROM news ORDER BY id DESC";
  mySQL.query(sql, function (results,err) {
    if (err) throw err;
    res.json({ news: results });
  });
});

app.get('/api/secret', function (req, res) {
  return Common.token(req, res);
});

app.post('/api/logout', withAuth, function (req, res) {
  res.cookie('token', null).sendStatus(200);
});

app.post('/api/register', function (req, res) {
  return User.register(pool, req, res);
});

app.post('/api/authenticate', function (req, res) {
  return User.authenticate(mysql,pool, req, res);
});

app.get('/api/getUserInfo', function (req, res) {
  return User.getUserInfo(pool, req, res);
});

app.get('/checkToken', withAuth, function (req, res) {
  return withAuth;
});

app.listen(process.env.PORT || 4000);
