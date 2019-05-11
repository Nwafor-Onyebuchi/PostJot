const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Load passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

//Connect to Mongose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static 
app.use(express.static(path.join(__dirname, 'public')));

//method-override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect-flash middleware
app.use(flash());



//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


// Index Route

app.get('/', (req, res) => {
    const title = 'Welcome to POSTJot';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/About', (req, res) => {
    res.render('About');
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});