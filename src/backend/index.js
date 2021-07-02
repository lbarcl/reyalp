//* ------------------------------- EXPRESS ------------------------------------
const express = require('express')
const app = express()
const port = process.env.PORT || 80
//* ------------------------------- UTILS --------------------------------------
const { log } = console
const chalk = require('chalk')
const path = require('path')
const src = __dirname.replace('backend', '')
require('dotenv').config()

//* ------------------------------- INIT ---------------------------------------
app.listen(port, () => log(chalk.green(`[BACK-END] Started listeing on ${port}`)))

//* ------------------------------- MIDLEWARE ----------------------------------
app.use(express.json())
//? app.use((req, res, next) => {log(req._parsedUrl); next()}) Debug purposes
app.use('/static', express.static(path.join(src, 'public')))

//* ------------------------------- ROUTES -------------------------------------
app.get('/', (req, res) => {
    res.sendFile(path.join(src, 'public/html/index.html'))
})
app.use('/api', require('./routes'))
