const IMG_SIZE = 256;

function KeyboardController(keys, repeat) {
    var timers= {};
    document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };
    window.onblur= function() {
        for (key in timers)
            if (timers[key]!==null)
                clearInterval(timers[key]);
        timers= {};
    };
};

let socket = io();

function createUserElement() {
    const userTemplate = document.getElementById("user-template");

    let userElement = userTemplate.content.cloneNode(true).querySelector("div.user-container");

    return userElement;
}

function createUser(user_id, position) {
    let user = createUserElement();

    user.classList.add("img");
    
    user.querySelector("img").src = `https://picsum.photos/${IMG_SIZE}/${IMG_SIZE}?random=${user_id}`;
    user.setAttribute("data-user-id", user_id);
    
    user.style.left = position[0] + "px";
    user.style.top = position[1] + "px";
    
    document.getElementById("container").appendChild(user);

    return user;
}

socket.on('test-imagedisplay-register', (data) => {
    let [user_id, position] = data;
    createUser(user_id, position);
})

socket.on('test-imagedisplay-logout', (user_id) => {
    let img = document.getElementById("container").querySelector(`[data-user-id="${user_id}"]`);
    document.getElementById("container").removeChild(img);
})

socket.on('test-imagedisplay-move', (data) => {
    let [user_id, position] = data;
    let [x, y] = position;

    let img = document.getElementById("container").querySelector(`[data-user-id="${user_id}"]`);

    img.style.left = x + "px";
    img.style.top = y + "px";
});

function registerSelf() {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let user_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let position = [x, y];

    socket.emit('test-imagedisplay-register', [user_id, position]);

    controlled = createUser(user_id, position);
}

KeyboardController({
    37: function() { Move(-1, 0); },
    38: function() { Move(0, -1); },
    39: function() { Move(1, 0); },
    40: function() { Move(0, 1); }
}, 50);

function Move(x, y) {
    if (!controlled) return;
    controlled.style.left = (parseInt(controlled.style.left) + x * 10) + "px";
    controlled.style.top = (parseInt(controlled.style.top) + y * 10) + "px";

    socket.emit('test-imagedisplay-move', [parseInt(controlled.style.left), parseInt(controlled.style.top)]);
}

registerSelf();

function displayBubble(user, message) {
    const bubble = user.querySelector(".bubble")
    bubble.classList.remove("fade");

    bubble.innerHTML = message;

    setTimeout(() => {
        bubble.classList.add("fade");
    }, 10000);
}

document.getElementById("chatbox").addEventListener("keyup", function(event) {
    if (event.key == 'Enter') {
        socket.emit('test-imagedisplay-chat', document.getElementById("chatbox").value);
        displayBubble(controlled, document.getElementById("chatbox").value);

        event.preventDefault();
        document.getElementById("chatbox").value = "";
    }
});

socket.on('test-imagedisplay-chat', (data) => {
    let [user_id, message] = data;
    let user = document.getElementById("container").querySelector(`[data-user-id="${user_id}"]`);
    displayBubble(user, message);
});