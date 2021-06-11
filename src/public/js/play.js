var list = []

const audio = document.getElementsByTagName('audio')[0]
const footer = {
    'main': document.getElementById('footer'),
    'img': document.getElementById('footer-album'),
    'title': document.getElementById('footer-title'),
    'contorol': {}
}

function play(type, id) {
    switch (type) {
        case 'pl':
            clear()
            shuffleAndAdd(id)
            changeCurrent(list[0])
            break
        case 'track':
            addToFront(id)
            break
    }
}

function clear() {
    list = []
}

function skip() {
    if (list.length > 0) {
        list.shift()
        changeCurrent(list[0])
    }
}

function shuffleAndAdd(id) {
    const pl = JSON.parse(localStorage.getItem(id))
    const tracks = pl.tracks

    var currentIndex = tracks.length

    while (0 !== currentIndex) {
        var randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        var temp = tracks[currentIndex]
        tracks[currentIndex] = tracks[randomIndex]
        tracks[randomIndex] = temp
    }

    list = tracks
}

async function addToFront(id) {
    try {
        const response = await axios.get(`/api/spotify/track/${id}`)
        list.unshift(response.data)
        changeCurrent(list[0])
    } catch (error) {}
}

async function changeCurrent(track) {
    try {
        const response = await axios.get(`/api/apifree/spotify?id=${track.id}`).catch(skip)
        audio.src = `/api/youtube/play?url=${response.data.youtube.url}`
        audio.play()
        footer.img.src = track.image
        footer.title.innerText = track.name
        footer.main.style.display = 'grid'
    } catch (error) {
        skip()    
    }
}

audio.addEventListener("ended", skip)

audio.addEventListener("error", skip)