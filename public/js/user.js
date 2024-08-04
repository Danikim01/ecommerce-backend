const socket = io();

function deleteUser(uid){
    const message = {
        uid
    }
    socket.emit('deleteUser', message);
}

function changeRole(uid){
    const message = {
        uid
    }
    socket.emit('changeRole', message);
}

function crearUsuarios(users){
    if(users.length === 0){
        return "<h2>No hay usuarios</h2>"
    }
    let html = "";
    users.forEach(user => {
        html += `
        <div class="user-card">
            <h3>${user.full_name}</h3>
            <p>${user.email}</p>
            <p>${user.role}</p>
            <a href="" class="button-home" onclick="deleteUser('${user._id}')">Eliminar</a>
            <a href="" class="button-home" onclick="changeRole('${user._id}')">Cambiar Rol</a>
        </div>
        `
    });
    return html;
}

socket.on("sendingAllUsers", (users) => {
    const contenedorUsuarios = document.getElementById('users-box')
    contenedorUsuarios.innerHTML = crearUsuarios(users);
    location.reload();  
})


socket.on("statusError", (error) => {
    alert(error)
});