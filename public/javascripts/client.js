const socket = io();

var username;

var chats = document.querySelector('.chats');
var users_list = document.querySelector('.memberList');
var users_count = document.querySelector('.users-count');
var button = document.querySelector('#send');
var msg_send = document.querySelector('#user-message')

do{
   username =  prompt("Enter your username: ")
}while(!username);

// It will be called whenever a user is joining.
socket.emit("new-user-joined", username);


// It will be notifying about the user joined.
socket.on("user-connected", (socket_name)=>{
    userJoinLeft(socket_name, 'joined')
});


// Function to handle join or left div information structure.
function userJoinLeft(name, status){
    let dynamic = document.createElement('div');
    dynamic.classList.add('user-join');
    let content = `<p><b> ${name} </b>${status} the chat!</p>`;  
    dynamic.innerHTML = content;
    chats.appendChild(dynamic);
    chats.scrollTop = chats.scrollHeight;
}


// It will be notifying about the user left.
socket.on("user-disconnected", (user)=>{
    userJoinLeft(user, 'left')
})


// It will be updating the users list and count.
socket.on("user-list", (users)=>{
    users_list.innerHTML = "";
    users_arr = Object.values(users)
    for(i=0; i<users_arr.length; i++){
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerText = users_arr.length;
})


// To send and recieve messages.
button.addEventListener('click', ()=>{
    let data = {
        user: username,
        msg: msg_send.value
    };
    if(msg_send.value!=''){
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        msg_send.value = '';
    }
});

function appendMessage(data, status){
    let msgDynamic = document.createElement('div');
    msgDynamic.classList.add('message', status);
    let content2 = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;

    msgDynamic.innerHTML = content2;
    chats.appendChild(msgDynamic);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data)=>{
    appendMessage(data, 'incoming')
})