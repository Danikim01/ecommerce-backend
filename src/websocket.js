import productManagerDB from "./dao/productManagerDB.js";
import messageManagerDB from "./dao/messageManagerDB.js";
const ProductManagerDB = new productManagerDB();
const MessageManagerDB = new messageManagerDB();

export default io => {
    io.on("connection", async socket => {
        console.log("Nuevo cliente conectado -----> ", socket.id);

        socket.on("sendProduct", async product => {
            try{
                await ProductManagerDB.createProduct(product);
                const products = await ProductManagerDB.getAllProducts();
                console.log("Sending products desde del servidor", products);
                socket.emit("sendingAllProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                const result = await ProductManagerDB.deleteProduct(data.pid);
                const products = await ProductManagerDB.getAllProducts();
                socket.emit("sendingAllProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        
        let messages = await MessageManagerDB.getAllMessages();
        if(messages.length > 0){
            io.emit("sendingAllMessages", messages);
        }

        socket.on("send_message", async message => {
            console.log("Recibiendo mensaje: ", message);
            await MessageManagerDB.createMessage(message);
            const messages = await MessageManagerDB.getAllMessages(); // Actualiza la lista de mensajes
            io.emit("sendingAllMessages", messages);
        });
        

    });
}