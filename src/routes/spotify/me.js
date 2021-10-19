const router = require('express').Router()
const axios = require('axios')

//* Get Authenticated userprofile
router.get('/', async (req, res) => {
    const accessToken = req.access_token || req.cookies.access_token

    try {
        const response = await axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: 'Bearer ' + accessToken } })
        res.send(response.data)
    } catch (error) {
        res.sendStatus(401)
    }
})

//* Get Authenticated user playlists
router.get('/playlists', async (req, res) => {
    const accessToken = req.access_token || req.cookies.access_token
    const headers = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', headers)
        const playlists = response.data.items
        var con = (response.data.next) ? true : false
        while (con) {
            response = await axios.get(response.data.next, headers)
            for (let i = 0; i < response.data.items.length; i++) {
                playlists.push(response.data.items[i])
            }
            con = (response.data.next) ? true : false
        }
        res.header("Content-Type", 'application/json')
        res.send(JSON.stringify(playlists, null, 4))
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

//* Create a playlist for authorized user 
router.post('/playlists/new', async (req, res) => {
    const accessToken = req.access_token || req.cookies.access_token
    const userId = req.query.userid
    
    try {
        const response = await axios({
            url: `https://api.spotify.com/v1/users/${userId}/playlists`,
            method: 'post',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: req.body
        })
        res.satatus(response.status).send(response.data)
    } catch (error) {
        res.sendStatus(500)
    }
})

//* Update user owned playlist
router.put('/playlists/:id', async (req, res) => {
    const accessToken = req.access_token || req.cookies.access_token
    try {
        const response = await axios({
            url: `https://api.spotify.com/v1/playlists/${playlist_id}`,
            method: 'put',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: req.body
        })
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/playlists/:id/tracks', async (req, res) => {
    const accessToken = req.access_token || req.cookies.access_token

    try {
        const response = await axios({
            url: `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: req.body
        })
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

router.delete('/playlists/:id/tracks', async (req, res) => {
    const accessToken = req.access_token || req.cookies.access_token

    try {
        const response = await axios({
            url: `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
            method: 'delete',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            data: req.body
        })
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
})

module.exports = router