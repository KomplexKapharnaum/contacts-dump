let socket = io();

const adminMessage = document.getElementById('admin-message');
const adminAccept = document.getElementById('admin-accept');
const adminReject = document.getElementById('admin-reject');

var verifying = false
function isMessageAvailable() {
    if (verifying) return
    verifying = true
    socket.emit('admin-request-message')
}

const password = 'admin'
socket.emit('admin-auth', password)

socket.emit('admin-request-message')

socket.on('admin-new-message', function() {
    isMessageAvailable()
});

let currrent_message = null
socket.on('admin-request-message', function(message) {

    if (!message) {
        currrent_message = null
        verifying = false
        return
    }

    adminMessage.innerText = message.text
    currrent_message = message
})

function admin_approve(bool) {
    if (!currrent_message) return
    socket.emit('admin-verify-message', currrent_message, bool)
    socket.emit('admin-request-message')
    adminMessage.innerText = ''
}

adminAccept.addEventListener('click', function() {admin_approve(true)})
adminReject.addEventListener('click', function() {admin_approve(false)})
