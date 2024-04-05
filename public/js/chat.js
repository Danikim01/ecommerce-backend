const socket = io();

const user_email = document.querySelector("#email");
const user_message = document.querySelector("#chatBox");


function send_message(){
    const message = {
        user: user_email.value,
        message: user_message.value
    }
    user_message.value = "";
    user_email.value = "";
    socket.emit("send_message", message);
}
