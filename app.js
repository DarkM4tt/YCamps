require('dotenv').config()
var express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const methodOverride = require('method-override')
const flash = require('connect-flash')

// Requiring routes
const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')

const db = process.env.DATABASE

mongoose
  .connect(db)
  .then(() => {
    console.log('MONNGO CONNECTION OPEN!!!')
  })
  .catch((err) => {
    console.log('OH NO MONGO ERROR!!!!')
    console.log(err)
  })

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())

// PASSPORT CONFIG
app.use(
  require('express-session')({
    secret: 'shibas are the best dogs in the world.',
    resave: false,
    saveUninitialized: false,
  })
)

app.locals.moment = require('moment')
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

app.get('*', function (req, res) {
  res.render('error')
})

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on 3000')
})
