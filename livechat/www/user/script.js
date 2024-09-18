let socket = io();

// User side
const chatContainer = document.getElementById('chat-container');
const chatbox = document.getElementById('chatbox');
const chatSend = document.getElementById('chat-send');

function login(uuid, username) {
    socket.emit('user-login', uuid, username);

    socket.once('user-login-pong', function() {
        chatContainer.classList.add('enabled')
    })
}


const prompt_uuid = prompt("Enter your UUID: ");
const prompt_name = prompt("Enter your username: ");
login(prompt_uuid, prompt_name)

chatSend.addEventListener('click', function() {
    if (chatbox.value.length < 1) return
    socket.emit('send-message', prompt_uuid, chatbox.value)
    chatbox.value = ''
})