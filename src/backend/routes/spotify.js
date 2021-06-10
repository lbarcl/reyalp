const router = require('express').Router()
const axios = require('axios')

router.get('/users/:id', async (req, res) => {
    const accessToken = await register()
    const id = req.params.id

    try {
        const response = await axios.get(`https://api.spotify.com/v1/users/${id}`, { headers: { "Authorization": `Bearer ${accessToken}` } })
        res.header("Content-Type", 'application/json')
        res.send(JSON.stringify(response.data, null, 4))
    } catch (err) {
        res.sendStatus(err.response.status)
    }
})

router.get('/users/:id/playlists', async (req, res) => {
    const accessToken = await register()
    const id = req.params.id
    const headers = { headers: { "Authorization": `Bearer ${accessToken}` } }
    var url = `https://api.spotify.com/v1/users/${id}/playlists`
    try {
        var response = await axios.get(url, headers)
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
        res.sendStatus(err.response.status)
    }
})

router.get('/playlists/:id', async (req, res) => {
    const accessToken = await register()
    const id = req.params.id
    const headers = { headers: { "Authorization": `Bearer ${accessToken}` } }
    var url = `https://api.spotify.com/v1/playlists/${id}`
    try {
        var response = await axios.get(url, headers)
        const playlist = {
            'id': response.data.id,
            'url': response.data.external_urls.spotify,
            'name': response.data.name,
            'image': response.data.images[0].url,
            'description': response.data.description,
            'length': response.data.tracks.total,
            'tracks': []
        }
        var con = (response.data.tracks.next) ? true : false
        response.data.tracks.items.forEach((item) =>  playlist.tracks.push(format(item.track)) )
        if (con) url = response.data.tracks.next
        while (con) {
            response = await axios.get(url, headers)
            response.data.items.forEach((item) => playlist.tracks.push(format(item.track)))
            con = (response.data.next) ? true : false
            if (con) url = response.data.next
        }
        res.header("Content-Type", 'application/json')
        res.send(JSON.stringify(playlist, null, 4))
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

function format(temp) {
    return {
        'id': temp.id,
        'url': temp.external_urls.spotify,
        'name': temp.name,
        'image': temp.album.images[0].url,
        'artist': temp.artists
    }
}

async function register() {
    const response = await axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: process.env.CLIENT_ID,
            password: process.env.CLIENT_SECRET
        }
    })
    return response?.data?.access_token
}

module.exports = router