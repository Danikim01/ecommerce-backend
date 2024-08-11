import messageController from "./controller/messageController.js";
import transport from "./utils/transport.js";
import { productsService,usersService,cartsService } from "./repositories/index.js";

const mm = new messageController();


export default io => {
    io.on("connection", async socket => {
        console.log("Nuevo cliente conectado -----> ", socket.id);

        const send_mail = async (product) => {
            try{
                const user = await usersService.getUserByEmail(product.owner);
                if (user.role == "premium"){
                    const result = await transport.sendMail({
                        from: 'noreply <danikim01lol@gmail.com>',
                        to: product.owner,
                        subject: 'Product Removed Notification',
                        html: ` <div>
                                    <h1>Your Product: "${product.title}" has been removed!</h1>
                                </div>`
                    });
                }
            }catch(error){
                io.emit("statusError", error.message);
            }
        }

        socket.on("deleteProduct", async (data) => {
            try {
                const { pid, userEmail } = data;
                const product = await productsService.getProductByID(pid);
                if (!product) {
                    io.emit("statusError", "Producto no encontrado");
                    return;
                }
        
                if (userEmail != "admin@gmail.com" && userEmail !== product.owner) {
                    io.emit("statusError", "No tiene permisos para eliminar este producto");
                    return;
                }
        
                await productsService.deleteProduct(pid);
                send_mail(product);
                const products = await productsService.getAllProducts();
                socket.emit("sendingAllProducts", products);
        
            } catch (error) {
                io.emit("statusError", error.message);
            }
        });
        
        
        let messages = await mm.getAll();
        if(messages.length > 0){
            io.emit("sendingAllMessages", messages);
        }

        socket.on("send_message", async message => {
            await mm.create(message);
            const messages = await mm.getAll(); // Actualiza la lista de mensajes
            io.emit("sendingAllMessages", messages);
        });
        
        socket.on("addProductToCart", async message => {
            try{
                const user_id = message.uid;
                const product_id = message.pid;

                const product = await productsService.getProductByID(product_id);
                if(!product){
                    io.emit("statusError", "Producto no encontrado");
                    return;
                }

                const user = await usersService.getUser(user_id);
                if(!user){
                    io.emit("statusError", "Usuario no encontrado");
                    return;
                }

                if(product.owner === user.email){
                    socket.emit("statusError", "No puedes agregar a tu carrito un producto que te pertenece");
                    return;
                }

                await cartsService.addProductToUsersCart(message.uid,message.pid);
                io.emit("statusError", "Producto agregado al carrito");
            }catch(error){
                io.emit("statusError", error.message);
            }
        })

        socket.on("removeProduct", async message => {
            try {
                const cid = message.cid;
                const pid = message.pid;
        
                const cart = await cartsService.getProductsFromCart(cid);
                if (!cart) {
                    socket.emit("statusError", "Carrito no encontrado");
                    return;
                }
        
                const product = await productsService.getProductByID(pid);
                if (!product) {
                    io.emit("statusError", "Producto no encontrado");
                    return;
                }
        
                await cartsService.deleteProductFromCart(cid, pid);
                socket.emit("productRemoved");
            } catch (error) {
                io.emit("statusError", error.message);
            }
        });


        const send_filtered_users = async (status_message) => {
            const users = await usersService.getAllUsers();
            const filtered_users = users.filter(user => user.role !== "admin");
            const message = {
                payload: filtered_users,
                status_message
            }
            io.emit("sendingAllUsers", message);
        }

        socket.on("deleteUser", async (data) => {
            try{
                const uid = data.uid;
                await usersService.deleteUser({_id:uid});
                send_filtered_users("User deleted successfully");
            }catch(error){
                io.emit("statusError", error.message);
            }
        })
        
        socket.on("changeRole", async (data) => {
            try{
                const uid = data.uid;
                await usersService.changeRole(uid);
                send_filtered_users("User Role changed successfully");
            }catch(error){
                io.emit("statusError", error.message);
            }
        })

    });
}