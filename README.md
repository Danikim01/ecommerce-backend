# Arquitectura del proyecto

## Patrones de diseño utilizados en la capa de persistencia

* DAO (Data Access Object) : El DAO permite la persistencia aislada, esto se logra separando la logica de acceso a la fuente de datos en un archivo.Dao se encargará de conectar con nuestra fuente de datos según la hayamos programado. Así, en la lógica de negocio sólo se necesita importar el DAO a trabajar y utilizarlo. Si en algún momento necesitamos cambiar de persistencia, bastará con cambiar el DAO. 
    * Ejemplos: Los archivos dentro de src/dao/mongo/services son DAOS.

* DTO (Data Transfer Object) : DTO es un patrón de diseño que sirve para resolver casos en los que existe este factor de “incertidumbre” en el que no sabemos si los datos serán siempre consistentes, ya sea en existencia o en tipo de dato. Además, nos permite transformar la información y crear un dato antes de transferirlo.

* Repository: El patrón repository es sumamente útil para poder desacoplar aún más la lógica del DAO y del negocio, contando con una capa de “servicios” el cual se encargará de ejecutar la instrucción para obtener la información del DAO.La idea de la capa de servicios es añadir un nivel extra de abstracción para dejar cada vez más limpio y entendible el negocio. 

    



