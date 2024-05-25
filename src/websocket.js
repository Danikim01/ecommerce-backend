import productController from "./controller/productController.js";
import messageController from "./controller/messageController.js";

const pm = new productController();
const mm = new messageController();

export default io => {
    io.on("connection", async socket => {
        console.log("Nuevo cliente conectado -----> ", socket.id);

        socket.on("sendProduct", async product => {
            try{
                await pm.create(product);
                const products = await ProductManagerDB.getAllProducts();
                console.log("Sending products desde del servidor", products);
                socket.emit("sendingAllProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                const result = await pm.delete(data.pid);
                const products = await pm.getAll();
                socket.emit("sendingAllProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        
        let messages = await mm.getAll();
        if(messages.length > 0){
            io.emit("sendingAllMessages", messages);
        }

        socket.on("send_message", async message => {
            console.log("Recibiendo mensaje: ", message);
            await mm.create(message);
            const messages = await mm.getAll(); // Actualiza la lista de mensajes
            io.emit("sendingAllMessages", messages);
        });
        

    });
}