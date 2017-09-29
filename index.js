var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var favicon = require('serve-favicon');
var authenticate = require('./authenticate');
var config = require('./config');
var cors = require('cors');
var helmet = require('helmet');

// connect to db
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('Connected correctly to server');
});

// require routers
var categoryRouter = require('./routes/categoryRouter');
var menuItemsRouter = require('./routes/menuItemsRouter');
var usersRouter = require('./routes/usersRouter');
var ordersRouter = require('./routes/ordersRouter');

// var hostname = 'localhost';
// var port = 5000;
var app = express();
app.set('port', (process.env.PORT || 5000));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure Helmet headers
// app.use(helmet.xframe());
// app.use(helmet.xssFilter());
// app.use(helmet.nosniff());
// app.use(helmet.ienoopen());
// app.disable('x-powered-by');

// configure cross-origin resource sharing
app.use(cors());
app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');
    next();
});

// passport config
app.use(passport.initialize());

// set up static routes
app.use(express.static(path.join(__dirname, 'public')));

// use routers
app.use('/categories', categoryRouter);
app.use('/menu_items', menuItemsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

// error handling
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// app.listen(port, hostname, function(){
// 	console.log(`Server running at http://${hostname}:${port}/`);
// });