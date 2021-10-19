const router = require('express').Router()
const axios = require('axios')

router.use('/', require('./public'))
router.use('/me', require('./me'))

router.get('/auth/redirect', async (req, res) => {
    const code = req.query.code
    const response = await axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type':'application/x-www-form-urlencoded'
        },
        params: {
            code: code,
            grant_type: "authorization_code",
            redirect_uri: process.env.SPOTI_REDIRECT
        }
    }).catch(err => { console.log(err); res.sendStatus(500)})
    res.cookie('refresh_token', response.data.refresh_token)
    res.cookie('access_token', response.data.access_token, { expires: new Date(Date.now() + 3600 * 1000) })
    res.redirect('http://localhost:5000')
})

router.get('/auth', (req, res) => {
    const scopes = 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative'
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&scope=${scopes}&redirect_uri=${process.env.SPOTI_REDIRECT}`)

})

module.exports = router