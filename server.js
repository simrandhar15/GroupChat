var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var path = require('path')
var passport = require('passport')
var flash  = require('connect-flash');
var session = require('express-session');
//Import Node HTTP server
var http = require('http').Server(app)

//Import SocketIO
var io = require('socket.io')(http)

//Import Mongoose
var mongoose = require('mongoose')


require('./config/passport')(passport);


//Get Database Config
var dbConfig = require('./config/database')

var Message = require('./model/message')

var cookieParser = require('cookie-parser');

//Set View engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'nodejsisawesome' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var dbUrl = dbConfig.database

app.get('/', (req, res) => {
	res.render('login.ejs')
})

app.get('/chat', isLoggedIn, (req, res) => {
	res.render('index.ejs', {
		user: req.user
	})
})

app.get('/messages', isLoggedIn, (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:user', isLoggedIn, (req, res) => {
    var user = req.params.user
    Message.find({name: user}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {

    try {
        var message = new Message(req.body)

        var savedMessage = await message.save()

        console.log('saved')

        var censored = await Message.findOne({ message: 'badword' })

        if (censored)
            await Message.remove({ _id: censored.id })
        else
            io.emit('message', req.body)

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    }
})

app.get('/login', function(req, res) {
        res.render('login.ejs'); // load the index.ejs file
});

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/exit');
    });

app.get('/exit', function(req, res) {
        res.render('exit.ejs'); // load the index.ejs file
});

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/chat',
                failureRedirect : '/login-error'
        }));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(process.env.PORT || 3000, () => {
    console.log('server is listening on port', server.address().port)
})