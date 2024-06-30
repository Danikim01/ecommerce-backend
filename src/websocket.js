import productController from "./controller/productController.js";
import messageController from "./controller/messageController.js";
import cartController from "./controller/cartController.js";
import passport from "passport";

const pm = new productController();
const mm = new messageController();
const cm = new cartController();

export default io => {
    io.on("connection", async socket => {
        console.log("Nuevo cliente conectado -----> ", socket.id);

        socket.on("sendProduct", async product => {
            try{
                console.log("Recibiendo producto: ", product)
                await pm.createProduct(product);
                const products = await pm.getAllProducts();
                console.log("Sending products desde del servidor", products);
                socket.emit("sendingAllProducts", products);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });


        socket.on("deleteProduct", async (data) => {
            try {
                const { pid, userEmail } = data;
                console.log("user email: ", userEmail, "pid: ", pid);
                const product = await pm.getProductByID(pid);
                if (!product) {
                    socket.emit("statusError", "Producto no encontrado");
                    return;
                }
        
                if (userEmail != "admin@gmail.com" && userEmail !== product.owner) {
                    socket.emit("statusError", "No tiene permisos para eliminar este producto");
                    return;
                }
        
                await pm.deleteProduct(pid);
                const products = await pm.getAllProducts();
                console.log("Enviando products desde del servidor", products);
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
        
        socket.on("addProductToCart", async message => {
            try{
                await cm.addProductToUsersCart(message.uid,message.pid);
            }catch(error){
                socket.emit("statusError", error.message);
            }
        })

    });
}