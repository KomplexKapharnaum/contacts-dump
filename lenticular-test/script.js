const IMG_COUNT = 20

const container = document.getElementById('lenticular-image')

function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function loadImages(count) {
    for (let i = 0; i < count; i++) {
        const image = document.createElement('img')
        image.src = 'https://picsum.photos/id/' + i + '/512/512'
        container.appendChild(image)
    }
}

loadImages(IMG_COUNT)

function setOpacity(el, opacity) {
    el.style.opacity = opacity
}

function setAngle(angle) {
    container.style.transform = 'rotateY(' + angle + 'deg)'
}

let i = 0
setInterval(async () => {

    container.classList.remove("transition")
    container.querySelectorAll('img').forEach(element => {
        setOpacity(element, 0)
    });

    let a = i%2 == 0 ? -45 : 45
    let image1 = container.children[i%IMG_COUNT]
    let image2 = container.children[(i+1)%IMG_COUNT]

    image1.style.ZIndex = 0
    image2.style.ZIndex = 1

    image1.style.opacity = 1

    await new Promise(r => setTimeout(r, 1))
    container.classList.add("transition")

    setAngle(a)

    setOpacity(image1, 0)
    setOpacity(image2, 1)

    i++

}, 1000)