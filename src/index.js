//* ------------------------------- EXPRESS ------------------------------------
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 80
//* ------------------------------- UTILS --------------------------------------
const { log } = console
const chalk = require('chalk')
const axios = require('axios')
//require('dotenv').config()

//* ------------------------------- INIT ---------------------------------------
app.listen(port, () => log(chalk.green(`[BACK-END] Started listeing on ${port}`)))

//* ------------------------------- MIDLEWARE ----------------------------------
//? app.use((req, res, next) => {log(req._parsedUrl); next()}) Debug purposes
const whiteList = ['http://reyalp.tk', 'http://localhost:5000', 'http://localhost', 'https://reyalp.tk']
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: "GET,PUT,POST,DELETE"
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(async (req, res, next) => {
    const path = req._parsedUrl.pathname
    if (path == '/' || path == '/spotify/auth' || path == '/spotify/auth/redirect') next()
    else if (req.cookies.access_token) next()
    else if (req.cookies.refresh_token) {
        const response = await axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            params: {
                grant_type: "refresh_token",
                refresh_token: req.cookies.refresh_token
            }
        }).catch(err => { console.log(err); res.sendStatus(401) })
        res.cookie('access_token', response.data.access_token, { maxAge: new Date(Date.now() + 3600 * 1000) })
        req.access_token = response.data.access_token
        next()
    } else {
        res.redirect('/spotify/auth')
    }
})

//* ------------------------------- ROUTES -------------------------------------
app.use('/', require('./routes'))