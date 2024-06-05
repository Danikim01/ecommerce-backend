# Tercera preentrega

Esta entrega por ahora esta bastante deprolija porque en algunas rutas el frontend se podria implementar/mejorar para mejorar la navegabilidad entre las diferentes rutas del programa pero creo que todas las funcionalidades que piden estan implementadas

## Arquitecture del proyecto


## Rutas

## Cosas a tener en cuenta:
El usuario tiene un carrito asociado, dicho carrito de momento es un vector de 1 solo elemento en el cual se aplico populate a la coleccion de carrito, esta coleccion a su vez tiene un populate a products.

Los permisos de administrador son chequeados en /middlware/admin.js y para los demas permisos se uso jwt + passport para setear req.user y el token. Es el archivo /middlewares/auth.js la cual chequea los permisos

En la ruta /views/products se implemento la muestra de todos los productos, creo que eso se podria mejorar dado que se esta repitiendo codigo (en api/products y /views/products) y desde el router se esta accediendo al modelo.