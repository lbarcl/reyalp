const router = require('express').Router()
const axios = require('axios')

// https://open.spotify.com/user/qvu23f7tmu0f4k1oe4l3ups59

router.get('/users/:id', async (req, res) => {
    const accessToken = await reqister()
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
    const accessToken = await reqister()
    const id = req.params.id
    const headers = { headers: { "Authorization": `Bearer ${accessToken}` } }
    var url = `https://api.spotify.com/v1/users/${id}/playlists`
    try {
        var response = await axios.get(url, headers)
        const playlists = response.data.items

        var con = (response.data.items.length >= 20) ? true : false
        while (con) {
            response = await axios.get(response.data.next, headers)
            for (let i = 0; i < response.data.items.length; i++) {
                playlists.push(response.data.items[i])
            }
            con = (response.data.items.length >= 20) ? true : false
        }

        res.header("Content-Type", 'application/json')
        res.send(JSON.stringify(playlists, null, 4))
    } catch (err) {
        res.sendStatus(err.response.status)
    }
})

router.get('/playlists/:id', async (req, res) => {
    const accessToken = await reqister()
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
        var length = playlist.length
        for (let i = 0; i < response.data.tracks.items.length; i++) {
            playlist.tracks.push(format(response.data.tracks.items[i].track))    
        }
        var con = (length > 100) ? true : false
        length -= 100
        while (con) {
            response = await axios.get(response.data.tracks.next, headers)
            for (let i = 0; i < response.data.items.length; i++) {
                playlist.tracks.push(format(response.data.items[0].track))
            }
            length -= response.data.items.length
            con = (length > 100) ? true : false
        }
        res.header("Content-Type", 'application/json')
        res.send(JSON.stringify(playlist, null, 4))
    } catch (err) {
        console.log(err)
        res.send()
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

async function reqister() {
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