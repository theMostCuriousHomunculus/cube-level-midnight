const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const authentication = require('../middleware/authentication')
require('../db/mongoose')

// use "/Users/Casey/mongodb/bin/mongod.exe --dbpath=/Users/Casey/mongodb-data" to start mongodb

//Define paths for Express configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()

const port = process.env.PORT

// app.use((req, res, next) => {
    // res.status(503).send('Site is currently under maintenance.  Check back later!')
// })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

// setup views and partials directories
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

const cubeRouter = require('../routers/cube-router')
const userRouter = require('../routers/user-router')
const blogRouter = require('../routers/blog-router')
const draftRouter = require('../routers/draft-router')

// render the homepage
app.get('/', authentication, async (req, res) => {
    res.render('home', {
        account_name: req.user.account_name,
        title: "Home"
    })
})

app.use(cubeRouter)
app.use(userRouter)
app.use(blogRouter)
app.use(draftRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})