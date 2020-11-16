# GZDB.js

> GZDB.js Es una forma simlple y ligera de usar indexeddb

Otros librerias que cumplen con este fin suelen tener miles de 
lineas de codigo que cargan tu documento haciendolo mas pesado. 

### **GZDB**
 Esta pequeña libreria esta pensada para ser muy minimalista 
 pero igual de eficaz. Nos ayuda a manejar indexedDB de una forma muy sencilla y solo agregando menos de trecientas lineas de codigo indentadas a nuestro archivo. 

 > Ligero, facil de usar, pero igual de eficaz
 
 **Metodos**

1. 
    **set()**
2. 
    **get()**
3. 
    **getAll()**
4.  
    **Update()**
5. 
    **Delete()**
6. 
    **DeleteDB()*

 #### Veamos como usar GZDB
 #

 1. 
    Creamos un nuevo objeto de tipo GZDB
    
    En este caso llamaremos a nuestra base de datos Clients 
    por lo tanto así se llamará nuestro objeto.

    ***No es obligatorio tenga el mismo nombre, pero es recomendable para la legibilidad de nuestro codigo. #Buenas_practicas***

    ```JS
        const Clients = new GZdb("Clients", 1)
        // GZDB(nombre, version)
    ```
    #
        Como observamos al crear el objeto de nuestra base de datos  pasamos dos parametros. Uno es el nombre y el otro es la version, esta puede ser cualquier numero entero. 
        podemos pasar un tercer parametro, este seria indicando el keypath y el autoIncrement. Bastaria con agregar una coma y luego de ella. 
        {keypath: "valor de keypath", autoIncrement: true (O) false}, Esto es opcional.

    ***En caso de no colocar el tercer parametro, este se agregara por defecto de la siguiente forma***

    ```JS
        {
            keyPath: "id",
            autoIncrement: true
        }
        //Quedando el ejemplo anterior configurado
        //de lasiguiente forma.
        const Clients = new GZdb("Clients", 1,  {
            keyPath: "id",
            autoIncrement: true
        }) 
        //En caso de pretender esta configuracion 
        //podemos obviar el keyPath y el autoincremnt.

    ```

    Como vimos agregar el keypath y el autoIncrement no es obligatorio ni del todo necesario. 
    #

    Para mas informacion sobre el keypath y el autoIncrement 
    puedes visitar la pagina de MDN que habla sobre el [CreateIndex de indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex)
    El hecho de obviar esto no hace ninguna diferencia importante. Simplemente el valor "id" se comprotara como identificador unico de cada elemento y se autoIncrementara a su vez no permitiendo ningun "id" duplicado.


2. Ahora creamos nuestro esquema. 

    GZDB esta principalmente inspirado en mongoose por lo cual 
    nos referimos a los Stores de indexedDB como esuquemas. 
    En bases de datos relacionales a esto se le conoce como tabla. 

    **Creacion del esquema (Shema)**

    ```JS

        Users.setSchema("Users", {
            name: "",
            apellido: "",
            telefono: "",
            user: {unique: true}
        })
        //Podemos usar objectParameters como 
        //{unique: true}
        //estos los pasamos siempre entre llaves {}
        //Unique true no permitira que este elemento se 
        //duplique en nuestra base de datos.
    ``` 
    #
    User.setSchema() recibe dos parametros como pudimos ver. 
    Uno es el nombre de nuestra coleccion y el otro es los campos que llevará. 
    Estos van dentro de laves {} colocando el nombre del indice como llave, por ejemplo **name** y dos parentecis al como valor **" "**. Esto se veeria asi. {name: ""}. 
    Como observamos puede tener varios indices, Tantos como queramos.

    #
    #
        Muy simple verdad? 
        Si quieres conocer mas objectParameters de inexedDB puedes visitar la pagina de MDN
    [ObjectParameters indexedDb](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex)
    #
        Estos parametros de los obetos son opcionales y podemos obviarlos. 

    #### ***De momento ya tenemos nuestra base de datos y nuestra coleccion***
    > Esto se veeria así: 
    ```JS
        const Clients = new GZdb("Clients", 1)

        Users.setSchema("Users", {
            name: "",
            apellido: "",
            telefono: "",
            user: {unique: true}
        })

        //Podemos agregar mas colecciones. 
    ```
#
5. 
    ___Agregar registros___

    ***Como todo en GZDB es facil agregar datos. Veamos como***

    > el metodo set recibe dos parametros. El primero 
    > es el nombre de la coleccion y el segundo un JSON con los 
    > datos

    ```JS
        Clients.set("Users", {
            name: "Anna", 
            apellido: "Guerrero",
            telefono: +57 3013338826,
            user: "anna01"
        })
        .then(e => console.log(e))
         /*Esto en caso de exito devolvera true*/

         //Agreguemos dos más, pero esta vez
         //Mandemoslos en un array

        Clients.set("Users", [{
            name: "Jhon", 
            apellido: "Guerrero",
            telefono: +57 3003338826,
            user: "Jhon1905"
        },{
            name: "Vanessa", 
            apellido: "Conde",
            telefono: +57 3003338826,
            user: "vaness"
        }
        ])
        .then(e => console.log(e))

    //Podemos agregar varios datos de esa forma
    ```

    Super facil ¿No?
#
4.
    ### ___pedir datos___
    #

    __En GZDB podemos pedir un dato o varios. Veamos como__

    >Para pedir un dato tenemos el metodo get. pero este nos 
    >sirve tambien para traer mas de un dato. Veamos como.

    #
    + Tenemos cuatro parametros para extraer un dato. 
        
        1. 
            La coleccion. En este caso es la anteriormente declarada en el Schema llamada "Users"  

        2. 
            El indice que usaremos para buscar. Declaramos: 
            name, apellido, telefono y user. Usaremos user

        3. El valor que debe tener ese indice por ejemplo. queremos extraer la informacion de anna, entonces usaremos "anna01"

        4. 
            La cantidad de registros que queremos traer. En este caso al buscar por el usuario solo tarera uno siempre. Pues solo existe un usuario con dicha credencial.
            Si buscaramos por nombre, GZDB nos traeria todos los usuarios con el mismo nombre. 

    **Traigamos los datos de enna**

    ```JS

        Clients.get("Users", "user", "anna01")
        .then(data => console.log(data))

        /*Esto nos devolvera todos los datos de anna
            [{
            name: "Anna", 
            apellido: "Guerrero",
            telefono: +57 3013338826,
            user: "anna01",
            id: 1
            }]

            No declaramos el id, pero lo vemos ahí
            Esto es porque GZDB agrega el nombre id 
            como keypath y indexedDB agrega un 
            identificador unico que va aumentando 
            1 por cada registro

            GZDB siempre devuelve un Array con los 
            datos. por lo que para acceder a ellos 
            necesitamos colocar el indice. En caso
            de ser un solo dato como aquí y quisieramos
            obtener el telefono de anna seria 
            data[0].telefono
        */

        //Al no declarar el cuarto parametro
        //GZDB nos traerá todos los registros. 
        //En este caso solo hay un registro, así
        //que podemos obviarlo
        
    ```
    **Traigamos todos los que tengan el apellido guerrero**
    > Anna y Jhon

    ```JS
        Clients.get("Users", "apellido", "Guerrero")
        .then(datos => console.log(datos))
        /* EL resultado sería
        [{
        name: "Jhon", 
        apellido: "Guerrero",
        telefono: +57 3003338826,
        user: "Jhon1905"
        },
        {
            name: "Anna", 
            apellido: "Guerrero",
            telefono: +57 3013338826,
            user: "anna01"
        }]

        */
       //Si colocaramos en el cuarto parametro 1
       //Nos devolveria solo un elemento, siendo este
       // el primero. Osea traeria los datos de anna

    ```
    ***
    ***Traer todos los datos de una colecion***

    >Para esto solo necesitamos un parametro. 
    >El nombre de la coleccion

    ```JS
        Clients.getAll("Users")
        .then(datos => console.log(datos))

        /*
            El resultado seria un array 
            todos los registros. Almacenando cada 
            registro en un JSON
        */
    ```
#
***
5.
    **Actualizar datos**

    > Actualizar un dato en GZDB es facil, igual que todo.
    > Veamos como hacerlo.

    El metodo Update() recibe cuatro parametros:

    _La coleccion, el indice con el que vamos a buscar, el valor del indice, los nuevos datos_

    **Cambiemos el apellido de anna a perez**
    ```JS

        Clients.Update("Users", "user", "anna01", 
            {apellido: "perez"}
        )
        .then(e => console.log(e))
        //Si todo sale bien nos devolvera true.
    ```

***

6. __Eliminar datos__

    > Eliminar datos tambien es facil. El metodo Delete()
    > Al igual que el metodo get recibe cuatro parametros. 
    > el nombre de la coleccion, el indice con el que se
    > va a buscar, el valor que debe tener el indice 
    > y la cantidad de elementos que se van a borrar. 
    > La cantidad de elementos a borrar por defecto es 1

    _Eliminemos a anna de nuestra coleccion_

    ```JS
        Clients.Delete("Users", "user", "anna01")
        .then(e => console.log(e))
        // Esto nos devolvera.
        //1 elements delete

    ```
    ___Imaginemos no cambiamos el apellido de anna ni la 
    eliminamos. Pero ahora queremos borrar a todos los guerrero___

    Bien podriamos indicar 2 pero colocaremos 0 para que borre todos los que coincidan.

    ```JS
        Clients.Delete("Users", "apellido", "Guerrero", 0)
        .then(e => console.log(e))

        /*
            Esto nos devolverá 
            2 elements delete. 

            Esto pasa porque cuando colocamos 0 
            se eliiminaran TODOS los elementos 
            que coincidan con lo que indicamos. 

            Si no colocamos nada en el cuarto parametro 
            solo borrara UN (1) elemento. siendo 
            este el primero que coincida. 

            Como aneriormente borramos a anna.
        */
    ```
    ****

7. 
    ### __Por ultimo podemos eliminar la base de datos con DeleteDB__

    > Esto es tan facil que puedo decirlo aquí.
    > Clients.DeleteDB()

    Para eliminar la base de datos hacemos uso de DeleteDB() 
    este metodo no recibe parametros. Pues eliminara la base de datos en 1024GB (entera). Veamos como eliminar nuestra base de datos Clients

    ```JS

        Clients.DeleteDB().then((res,db)=>console.log(res, db))

        //En este caso nos devuelve dos argumentos.
        //Uno con el booleano true en caso de exito 
        //Y otro con la informacion de la base de datos 
    ```

### ___Un pequeño CRUD usando GZDB___

```JS

//  Establecer la base de datos
    const Tareas = new GZdb("Tareas", 1)


//   Estableciendo los esquemas 
    Tareas.setSchema("Casa", {
        titulo: "",
        hora: "", 
        tarea: ""
    })

    Tareas.setSchema("Trabajo", {
        titulo: "",
        fecha: "",
        tarea: ""
    })

//  Agregando dos tareas a casa

    Tareas.set("Casa", [
        {
            titulo: "Shopping",
            hora: "15:40",
            tarea: "buy a new phone"
        }, 
        {
            titulo: "Cat",
            hora: "16:00",
            tarea: "feed the cat"
        }
    ])
    .then(res =>{
        alert(res)
    })

//  Agregando dos tareas al trabajo. 
//  Esta vez usando async/await y try{}catch()
    const setTaskJob = async()=>{
        try{
            const result = await Tareas.set("Trabajo", [
                {
                    titulo: "Create the new API", 
                    fecha: "27/12/2020", 
                    tarea: "Create the api to sleep"
                },
                {
                    titulo: "No se me ocurre mas nada", 
                    fecha: "22/02/22",
                    tarea: "Descansar"
                }
            ])

            alert(result)
        }catch(err){
            console.log(err)
        }
    }
    setTaskJob()

// En muchos casos es mejor async/await try/catch
// Y en otros como este es mejor usar then. Vemos aquí  
// que GZDB utiliza siempre promesas


//  Actualizando la hora de darle la comida al gato

    Tareas.Update("Casa", "titulo", "Cat", 
        {hora: "6:30"}
    )
    .then(alert)

//  ELiminando la tarea (No se me ocurre mas nada) con su fecha

    Tareas.Delete("Trabajo", "fecha", "27/12/2020")
    .then(alert)

// En caso de que alguien tenga la duda. es completamente 
//posible pasar ese alert de esa forma. Igual un console.log, etc

//  Ahora traeré la tarea del alimentar al gato usando su titulo

    Tareas.get("Casa", "titulo", "Cat")
    .then(console.log)

//  Traeré todas las tareas 

    Tareas.getAll("Casa")
    .then(console.log)

//  Y por ultimo eliminaré toda la base de datos

    Tareas.DeleteDB()
    .then(console.log)
```


> GZDB tiene un total de 286 lineas identadas y un peso de 8.3kb y en su version minificada son solo 3.3kb
> lo que no supone una perdida de rendimiento en donde vaya a usarse. Se recomienda usar la version minificada.

**GZDB Es compatible con navegadores que soporten ES6 o superior (2015 0 superior)**

***
_Los navegadores que no admitan indexedDB tendran GZdb como undefined_

> GZdb es funcional y estable, más se trabajara en futuras actualizaciones tratando de minificarlo y optimizarlo mas. 
***
***

___Gracias por leer___


