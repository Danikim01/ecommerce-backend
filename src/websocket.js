import productController from "./controller/productController.js";
import messageController from "./controller/messageController.js";
import cartController from "./controller/cartController.js";
import userController from "./controller/userController.js";


const pm = new productController();
const mm = new messageController();
const cm = new cartController();
const um = new userController();

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
                    console.log("Comparando: ", userEmail, "con: ", product.owner)
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
                const user_id = message.uid;
                const product_id = message.pid;

                //Además, modificar la lógica de carrito para que un usuario premium 
                //NO pueda agregar a su carrito un producto que le pertenece

                const product = await pm.getProductByID(product_id);
                if(!product){
                    socket.emit("statusError", "Producto no encontrado");
                    return;
                }

                const user = await um.getUser(user_id);
                if(!user){
                    socket.emit("statusError", "Usuario no encontrado");
                    return;
                }

                console.log("[Adding product to cart] user: ",user)
                console.log("[Adding product to cart] product: ",product)

                if(user.role === "premium" && product.owner === user.email){
                    console.log("No puedes agregar a tu carrito un producto que te pertenece")
                    socket.emit("statusError", "No puedes agregar a tu carrito un producto que te pertenece");
                    return;
                }

                await cm.addProductToUsersCart(message.uid,message.pid);
                socket.emit("statusError", "Producto agregado al carrito");
            }catch(error){
                socket.emit("statusError", error.message);
            }
        })

    });
}