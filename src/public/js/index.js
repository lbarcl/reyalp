const elements = {
    "body": document.getElementById('main'),
    "main": document.getElementById('content')
}

elements.body.onload = () => {
    var color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    elements.body.style.backgroundImage = `linear-gradient(180deg, rgb(${color[0]},${color[1]},${color[2]}) 0%, rgb(0,0,0) 85%)`
    var user = JSON.parse(localStorage.getItem('USER'))
    if (!user) {
        axios.get('/static/html/userform.html').then(result => {
            elements.main.innerHTML = result.data
        })
    } else {
        loadUser(user)
    }
}

function loadUser(user) {
    var content = `
    <h2 id="username">${user.display_name}</h2>
    <img src="${user.images[0].url}" id="pp">`
    elements.body.innerHTML += content
    loadPlaylists(user)
}

async function saveUser() {
    var url = document.getElementById('spotifyurl').value
    if (!url) return alert('URL boş kalamaz')
    else if (url.includes('spotify.com/user/')) {
        url = url.split('/')
        id = url[url.length - 1]
        try {
            const response = await axios.get(`/api/spotify/users/${id}`)
            localStorage.setItem("USER", JSON.stringify(response.data))
            window.location.reload()
        } catch (err) {
            if (err.response.status !== 200) return alert(`Provided URL is not valid`)
            console.log(err.response)
        }
    }
    else alert(`Provided URL is not valid`)
}

async function loadPlaylists(user) {
    const playlists = await axios.get(`/api/spotify/users/${user.id}/playlists`).catch(err => { return alert('Sistem içerisinde bir hata meydana geldi, daha sonra tekrar deneyiniz') })

    playlists.data.forEach(display)
    
    async function display(pl) {
        let limit = document.getElementById('playlists').clientWidth / 8
        let name = pl.name.length > limit ? pl.name.slice(0, limit - 3) + '...' : pl.name
        document.getElementById('playlists').innerHTML += `<button onclick="openplaylist('${pl.id}')">${name}</button>`
        const tracks = await axios.get(`/api/spotify/playlists/${pl.id}`).catch(err => { return alert('Sistem içerisinde bir hata meydana geldi, daha sonra tekrar deneyiniz') })
        sessionStorage.setItem(pl.id, JSON.stringify(tracks.data))
    }
}


function openplaylist(id) {
    const playlist = JSON.parse(sessionStorage.getItem(id))
    const tracks = []
    for (let i = 0; i < playlist.tracks.length; i++) {
        let track = playlist.tracks[i]
        tracks.push(trackFormat(i + 1, track.image, track.name, track.id, id))
    }

    document.getElementById('content').innerHTML = `
    <div class="playlist">
    <img class="playlist-img" src="${playlist.image}">
    <a href="${playlist.url}" target="_blank"><h2 class="playlist-name">${playlist.name}</h2></a>
    <div class="button-holder">
        <button class="play" onclick="play('${id}')"></button>
    </div>
    <hr>
    <div class="tracks">
        ${tracks.join(' ')}
    </div>
    </div>`

    function trackFormat(index, img, name, id, plid) {
        const html = `
        <div class="track">
            <button onclick="play('${id}', {'index':'${index}', 'plid':'${plid}'})">${index}</button>
            <img class="album" src="${img}">
            <h4 class="track">${name}</h4>
        </div>`
        return html
    }
}