# Backend ApiRest con NodeJs y MongoDB

Este proyecto no se creo con el cli de express, se crearon todos manualmente

## Documentacion de todas las rutas de la Api Rest
[Documentacion de todas las rutas](https://documenter.getpostman.com/view/1152694/RWM9xX1a)
Este enlace muestra todas las rutas que se crearon en la Api Rest (GET, POST, DELETE, UPDATE) con sus respectivos campos y los parametros que necesitan.

## Development server

`npm start` para correr el servidor de desarrollo
en el puerto 3000.

*Nota: se tiene que tener instalado MongoDB para que la api rest haga coneccion con la base de datos si no se tiene instalado no se podra iniciar el servidor de node.*

## Ruta Nueva

Para crear una Nueva ruta ejemplo :

`localhost:3000/nueva-ruta` 

se tiene que crear un nuevo archivo `nueva-ruta.js` en la carpeta `routes` del proyecto e implentar toda la logica