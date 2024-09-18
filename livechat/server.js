import http from 'http'
import express from 'express'
import { Server as IoServer } from "socket.io"

var app = express()
const server = http.createServer(app)
const io = new IoServer(server)

app.use('/', express.static('www'))

server.listen(4000, function () {
    var txt = 'listening on http'
    txt += '://*:' + 4000
    console.log(txt)
})

var chat = {
    users: {},
    pending_messages: [],
    history: []
}

function getOldestPendingMessage() {
    if (!chat.pending_messages.length) return null
    return chat.pending_messages.shift()
}

let message_id = 0
io.on('connection', function (socket) {
    // console.log('connected', socket.id)

    // User side
    socket.on("user-login", function(uuid, username) {

        if (!uuid || !username) return
        if (typeof uuid !== 'string' || typeof username !== 'string') return

        console.log('login', uuid, username)

        chat.users[uuid] = {
            username: username,
            admin: uuid=='admin'
        }

        socket.emit('user-login-pong')
    })
    
    socket.on("send-message", function(uuid, message) {

        if (!chat.users[uuid]) return
        if (message.length < 1 || message.length > 512) return

        const isAdmin = chat.users[uuid].admin

        const packet = {
            id: message_id++,
            username: chat.users[uuid].username,
            uuid: uuid,
            text: message,
            timestamp: Date.now(),
            admin: isAdmin
        }

        if (isAdmin) {
            chat.history.push(packet)
            io.to('livechat').emit('display-message', packet)
        } else {
            console.log('pending message', packet)
            chat.pending_messages.push(packet)        
            io.to('admin').emit('admin-new-message')
        }
    })

    // Admin side

    const isAdmin = (socket) => {
        return socket && socket.rooms && socket.rooms.has('admin')
    }

    socket.on("admin-auth", function(password) {
        if (password !== 'admin') return
        socket.join('admin')
    })

    socket.on("admin-request-message", function() {
        if (!isAdmin(socket)) return

        var message = getOldestPendingMessage()

        if (!message) {
            socket.emit('admin-request-message', false) 
            return
        }

        socket.emit('admin-request-message', message)
    })

    socket.on("admin-verify-message", function(message, approved) {
        if (!isAdmin(socket)) return

        if (!chat.users[message.uuid]) return

        if (approved) {
            
            console.log('approved message', [message.text])
            io.to('livechat').emit('display-message', message)

            chat.history.push(message)
        
        } else {
            console.log('rejected message', message.text)
        }

        socket.emit('admin-verified-message-pong')
    })

    // Display side

    socket.on("iam-livechat", function() {
        socket.join('livechat')
    })
})
