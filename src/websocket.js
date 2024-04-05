import productManagerDB from "./dao/productManagerDB.js";
const ProductManagerDB = new productManagerDB();

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


    });
}