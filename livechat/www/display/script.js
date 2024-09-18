let socket = io();

const livechatContainer = document.getElementById('livechat-container');

socket.emit("iam-livechat")

function displayMessage(message) {
    const timestamp = message.timestamp

    const timestamp_converted = new Date(timestamp).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
    const username = message.username
    const text = message.text

    livechatContainer.innerHTML += `
        <div class="message ${message.admin ? 'admin' : ''}" style="order: ${message.id}; z-index: ${message.admin ? message.id : 0};">
            <span class="username">${username}</span>
            <div>
                <span class="timestamp">${timestamp_converted}</span>
                <span class="text">${text}</span>
            </div>
        </div>
    `

    livechatContainer.scrollTo({
        top: livechatContainer.scrollHeight,
        behavior: 'smooth'
    })
} 

socket.on("display-message", function(message) {
    console.log(message)
    displayMessage(message)
})

const fakeMessages = [
    "J'adore ce festival !!!",
    "Vive la techno",
    "Le métavers nous dominera",
    "J'adore les jeux vidéos",
    "Je suis une entité du cyberespace",
    "Nous sommes livre",
    ":P",
    ":)",
    "C'est le futur, on est en 2024 !",
    "Je suis perdu dans le cyberespace",
    "Je veux une connexion internet plus rapide",
    "Je suis desole, j'ai hacke le site web",
    "Je prends mon cafe virtuel",
    "Je suis un etre virtuel",
    "Je suis un robot",
    "Je suis un ordinateur",
    "Je suis un telephone portable",
    "Je suis sur le web",
    "Je suis sur le reseau",
    "Je suis sur la toile",
    "Je suis sur internet",
    "C'est moi, le super-hacker",
    "Je suis le roi de la toile",
    "Je suis le seigneur des reseaux",
    "Je suis le maitre du cyberespace",
    "Je suis le dieu de l'informatique"
]

const fakeNames = [
    "Georges",
    "MasterPierre52",
    "EquityGrowth",
    "JesterBear",
    "Jevil",
    "Gab",
    "Snas67",
    "UtinamBesac",
    "Kzelno",
    "Yebeka",
    "Stebanou",
    "CoolGuy12",
    "Nelag",
    "Bengaming"
]

let fakePacketID = 0
function fakePackets(amount) {
    for (let i = 0; i < amount; i++) {
        displayMessage({
            id: fakePacketID++,
            username: fakeNames[Math.floor(Math.random()*fakeNames.length)],
            text: fakeMessages[Math.floor(Math.random()*fakeMessages.length)],
            timestamp: Date.now(),
            admin: Math.random()*50 < 1
        })
    }
}

function fakePacketsLoop() {
    const randomTime = Math.random()*1000
    fakePackets(Math.round(Math.random()*5))
    setTimeout(fakePacketsLoop, randomTime)
}

// fakePacketsLoop()