const elements = {
    "body": document.getElementsByTagName('body')[0],
    "main": document.getElementById('content'),
    "playlists": document.getElementById('playlists'),
    "profilepicture": document.getElementById('pp'),
    "username": document.getElementById('username'),
}

elements.body.onload = check

async function check() {
    var color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    elements.body.style.backgroundImage = `linear-gradient(180deg, rgb(${color[0]},${color[1]},${color[2]}) 0%, rgb(0,0,0) 85%)`
    var user = JSON.parse(sessionStorage.getItem("USER"))
    if (!user) {
        let url = await window.prompt("Kullanmak için lütfen spotify profil URL giriniz")
        if (url.includes('spotify.com/user/')) {
            url = url.split('/')
            id = url[url.length - 1]
            try {
                const response = await axios.get(`/api/spotify/users/${id}`)
                sessionStorage.setItem("USER", JSON.stringify(response.data))
                user = response.data
            } catch (err) {
                if (err.response.status !== 200) alert(`Provided URL is not valid`)
                check()
            }
            
        } else {
            alert("Provided URL is not valid")
            check()
        }
    }
    intialize(user)
}

async function intialize(user) {
    elements.profilepicture.src = user.images[0].url
    elements.username.innerText = user.display_name
    const response = await axios.get(`/api/spotify/users/${user.id}/playlists`)
    const playlists = response.data
    user.playlists = []
    playlists.forEach(async (playlist) => {
        user.playlists.push(playlist.id)
        var limit = 10
        var name = playlist.name.length > 10 ? playlist.name.slice(0, limit) + '...' : playlist.name
        elements.playlists.innerHTML += `<button onclick="loadplaylist('${playlist.id}')">${name}</button>`
        if (!sessionStorage.getItem(playlist.id)) {   
            const plres = await axios.get(`/api/spotify/playlists/${playlist.id}`)
            sessionStorage.setItem(playlist.id, JSON.stringify(plres.data))
        }
    })
    sessionStorage.setItem("USER", JSON.stringify(user))
}

function loadplaylist(id) {
    const playlist = JSON.parse(sessionStorage.getItem(id))
    axios.post('/log', playlist)
    const tracks = []
    for (let i = 0; i < playlist.tracks.length; i++) {
        let track = playlist.tracks[i]
        tracks.push(trackFormat(i + 1, track.image, track.name))
    }

    elements.main.innerHTML = `
    <div class="playlist">
    <img class="playlist-img" src="${playlist.image}">
    <a href="${playlist.url}" target="_blank"><h2 class="playlist-name">${playlist.name}</h2></a>
    <div class="button-holder">
        <button class="play" onclick="play('pl', '${id}')"></button>
    </div>
    <hr>
    <div class="tracks">
        ${tracks.join(' ')}
    </div>
    </div>`
}

function trackFormat(index, img, name, id) {
    const html = `
    <div class="track">
        <button onclick="play('track', '${id}')">${index}</button>
        <img class="album" src="${img}">
        <h4 class="track">${name}</h4>
    </div>`
    return html
}