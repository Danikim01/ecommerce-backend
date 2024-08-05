# Descripcion

Este proyecto es un ecommerce implementado mediante Node js 

# Funcionalidades

El sistema cuenta con un servicio de registro y almacenamiento de usuarios en una base de datos externa, lo cual permite que el usuario pueda logearse, recuperar su contraseña en caso de olvido y tener su propio perfil.

El usuario va a poder navegar a traves de la tienda online, consultar su carrito, ver productos, subir archivos y realizar su compra.

El proyecto cuenta con un sistema de autenticacion y permisos bastante robusto en donde los usuarios se pueden categorizar en distintos roles: user, premium, admin. Cada uno de los roles cuenta con su politica definida para que ningún usuario de un rol no especificado pueda acceder o realizar alguna operación sobre un acceso que no tenga autorizado. 

- Rol user: Este rol es el mas basico de todos. Se le proveen las funcionalidades mas basicas como comprar, ver los productos, subir archivos y consultar su carrito.
- Rol premium: A partir de este rol se pueden crear productos accediento al endpoint ```/realtimeproducts```, sin embargo no se le permiten eliminar productos de otros usuarios, solo los suyos.  
- Rol Admin: Este rol es el que tiene mas autoridad, se le provee la capacidad de crear, eliminar y manejar los productos de cualquier usuario. Tambien tiene la capacidad de gestionar los usuarios alojados en la base de datos. Puede eliminar los usuarios y tambien cambiarles el rol. 

# Detalles adicionales

- Un usuario que no haya tenido conexion en los ultimos dos dias pasará a ser ```inactive```, lo cual le impedira poder logearse al sistema.

- Si a un usuario premium le eliminan un producto o si el mismo usuario premium lo elimina, le llegara un mail notificandole que el producto fue eliminado.

- El usuario no puede agregar a su carrito un producto que haya creado

# Usuario Admin

A fines de poder probar las funcionalidades del usuario administrador es necesario acceder usando las credenciales del admin:
```
user: admin@gmail.com
contraseña: admin
```

# Setup
Es requisito necesario tener instalado Node.

Para instalar las dependencias necesarias:
```
npm install
```

Para levantar el servidor correr:

```
npm start
```

Para correr los test:

```
npm test
```

# Despliegue en Railway App

Actualmente la aplicacion web esta desplegada en: https://ecommerce-backend-production-1e48.up.railway.app/

# Arquitectura

El backend del proyecto utiliza una arquitectura basada en capas en donde los modulos contemplados dentro de nuestro aplicativo esta separado en "capas" las cuales tienen responsabilidades separadas y aisladas. 

En particular este proyecto trabaja con el modelo de capas base en donde se encuentran tres capas genéricas principales:

* Capa de Vista o Renderizacion
* Capa de Controlador o Negocio
* Capa de Modelo o Persistencia

![Capas Base](/public/img/capas%20base.png)

- Capa de persistencia: Esta capa tiene por principal objetivo la conexión directa con el modelo de persistencia a trabajar, es decir, debe saber conectar con la persistencia en memoria, en archivos o en bases de datos. Todo dependendiendo de cómo haya sido programada la capa.

- Capa de Negocio: Esta capa tiene como fin el desarrollar la lógica correspondiente a la acción de la función.  Es decir, debe realizar todas las operaciones necesarias para que la operación esté finalizada. Esta capa no puede acceder ni modificar directamente a los datos, sino que tiene que hacerlo a partir de la utilización de Persistencia.

- Capa de Renderizado: La capa de renderizado o Vista, como indica su nombre, sólo tiene la función de tomar datos para poder ser renderizados.

## Capas Adicionales usadas para node js

### Capa de routing

La capa de routing contendrá todos los archivos de tipo “router” que, como estamos ya acostumbrados, es una capa basada en redireccionamientos hacia puntos específicos de nuestra API

Actualmente, con el uso de motores de plantillas, nuestra capa de routing está estrechamente conectada con la capa de renderización (al utilizar un views router)


### Capa de servicio

La capa de servicios es una capa intermedia entre el controlador y la persistencia, en esencia, un servicio tiene la capacidad de servir como “tunel” de conexión, para que el controlador pueda acceder de manera más homologada a la persistencia.

Contar con una capa de servicio impide que los accesos a persistencia se hagan descontroladamente, con argumentos erróneos, etc.

Además, son el punto clave para aplicar un patrón repository.








## Patrones de diseño utilizados en la capa de persistencia

* DAO (Data Access Object) : El DAO permite la persistencia aislada, esto se logra separando la logica de acceso a la fuente de datos en un archivo.Dao se encargará de conectar con nuestra fuente de datos según la hayamos programado. Así, en la lógica de negocio sólo se necesita importar el DAO a trabajar y utilizarlo. Si en algún momento necesitamos cambiar de persistencia, bastará con cambiar el DAO. 
    * Ejemplos: Los archivos dentro de src/dao/mongo/services son DAOS.

* DTO (Data Transfer Object) : DTO es un patrón de diseño que sirve para resolver casos en los que existe este factor de “incertidumbre” en el que no sabemos si los datos serán siempre consistentes, ya sea en existencia o en tipo de dato. Además, nos permite transformar la información y crear un dato antes de transferirlo.

* Repository: El patrón repository es sumamente útil para poder desacoplar aún más la lógica del DAO y del negocio, contando con una capa de “servicios” el cual se encargará de ejecutar la instrucción para obtener la información del DAO.La idea de la capa de servicios es añadir un nivel extra de abstracción para dejar cada vez más limpio y entendible el negocio. 

    



