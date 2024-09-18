import http from 'http';
import express from 'express';
import { Server as IoServer } from "socket.io";

var app = express();
const server = http.createServer(app);
const io = new IoServer(server);

app.use('/', express.static('www'));

server.listen(4000, function () {
    var txt = 'listening on http'
    txt += '://*:' + 4000;
    console.log(txt);
});

var users = {};
io.on('connection', function (socket) {
    // console.log('a user connected');
    
    for (let user_id in users) {
        const [public_id, position] = users[user_id];
        socket.emit('test-imagedisplay-register', [public_id, position]);
    }

    socket.on('test-imagedisplay-register', function (data) {
        console.log(`user ${socket.id} connected`);
        users[socket.id] = data;
        socket.broadcast.emit('test-imagedisplay-register', data);
    });

    socket.on('test-imagedisplay-move', function (position) {
        let [user_id, _] = users[socket.id];
        socket.broadcast.emit('test-imagedisplay-move', [user_id, position]);
    })

    socket.on('test-imagedisplay-chat', function (message) {
        let [user_id, _] = users[socket.id];
        socket.broadcast.emit('test-imagedisplay-chat', [user_id, message]);
    })
        
    socket.on('disconnect', function () {

        if (users[socket.id]) {
            let [user_id, position] = users[socket.id];
            socket.broadcast.emit('test-imagedisplay-logout', user_id);
            delete users[socket.id];
        }

        console.log(`user ${socket.id} disconnected`);
    });
})
