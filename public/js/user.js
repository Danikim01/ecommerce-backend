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
            <p>${user.full_name}</p>
            <p>${user.email}</p>
            <p>${user.role}</p>
            <p>${user._id}</p>
            <button onclick="changeRole('${user._id}')">Cambiar rol</button>
            <button onclick="deleteUser('${user._id}')">Eliminar usuario</button>
        </div>
        `
    });
    return html;
}

socket.on("sendingAllUsers", (users) => {
    console.log("Users desde cliente: ",users)
    const contenedorUsuarios = document.getElementById('users-box')
    contenedorUsuarios.innerHTML = crearUsuarios(users);
    location.reload();
})
