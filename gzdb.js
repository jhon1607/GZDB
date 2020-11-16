class GZdb{

    constructor( name, version ){

        this.name = name 
        this.version = version 
        this.Schemas = []

//      Abre la base de datos para su uso
        this.db = async()=>{

//          Creacion de los almacenes de objetos con los esquemas pasados
            const 
                dbconnect = window.indexedDB.open(name, version),
                waitSucces = () => new Promise(resuelve => dbconnect.onsuccess = e  => resuelve(e.target.result))

            dbconnect.onupgradeneeded = e => {
                
                const db = e.target.result

                this.Schemas.forEach(schema => {

                    let store = db.createObjectStore(schema[0], schema[2])    
                    schema[1].forEach(e => {
                        console.log(e)
                        store.createIndex(e.index, e.index, e.condition)
                    })
                })
            }
        let db = await waitSucces()
        return db
        }
    }

    openCursor = async (colection, rwx, def)=>{
        const 
            db = await this.db(),
            Store = db.transaction(colection, rwx).objectStore(colection),
            query = Store.openCursor()

        query.onsuccess = e => def(e, Store)
        query.onerror = e => def({Error: e.target.error.message})
    }

//  Set schema 
    setSchema
    (
        name, 
        schema, 
        keyAndIncrement = {
            keyPath: "id",
            autoIncrement: true
        }
    ){
        const 
            Schema = [name, []],
            keys = Object.keys(schema)

        keys.forEach(key => {

//          Guardo la llave como indice y el valor como condicion
            if(typeof schema[key] == "object"){

                Schema[1].push
                (
                    {
                        index: key,
                        condition: schema[key]
                    }
                )

//          Solo guardo la llave 
            }else { 

                Schema[1].push({index: key})
            }

/*            
                El modelo final es el siguiente 
                ["nombre", {
                    index: key,
                    condition?: ValorOfKey
                },? {keyPath: "", autoIncrement: true}]
            
*/            
        })
        Schema.push(keyAndIncrement)
        //Agrego este esquema a los esquemas 
        this.Schemas.push(Schema)
    }

//  Get data from a collection with the index and value
    get = async (collection, index, value, length = 0)=>{

        let 
            elements = [],
            contador = 1
        length = typeof length == "number" ? length : 0

        const waitForSucces = () => new Promise(resolve => {
            
            this.openCursor(collection, "readonly", e => {

                let result = e.target.result
        
//              When the results finish, finish the promise and return them
                if(result == null){
    
                    elements = elements.length > 0 ? 
                        elements: false
                    resolve(elements)
                    return
                }
    
//              Validate and add the results that have the index and value
                if(result.value[index] == value)
                    
                    if(length == 0)
                    {
                            
                        elements.push(result.value)
    
                    }else if(length >= contador)
                    {
    
                        contador++
                        elements.push(result.value)   
                    }
    
                result.continue()
            })
        })

        return await waitForSucces()
    }

//  Get all the data from a colection
    getAll = async(colection) =>
    {
        let
            result = [],
            waitForSucces = () => new Promise( async resolve => {

                await this.openCursor(colection, "readonly", ev => {
    
                    const cursor = ev.target.result
                        
//                  save values
                    if (cursor)
                    {
                        let values = cursor.value
                        values["key"] = cursor.key
                        result =    result.concat(values)
                        cursor.continue()
                                  
                    }else 
                    {
                        if(result.length <= 0)
                            resolve({404: "Nothing to show"})
                        resolve(result)
                    }
                })
            })

        return await waitForSucces()
    }

//  Save data
    set = async (colection, datos)=>{

            let db = await this.db()

            const 
                transaction = db.transaction(colection, 'readwrite'),
                store = transaction.objectStore(colection),

                waitStatus = () => new Promise((resuelve, reject) =>{

                    transaction.onerror = e => reject(
                        {   
                            Error: e.target.error.message,
                            code: e.target.error.code
                        }
                    )
                    transaction.oncomplete = e => resuelve(true) 
                })
                

//          Si es un Array con varios datos a guardar los itera y guarda
            if(Array.isArray(datos))

                datos.forEach(data => store.add(data))

//          De lo contrario solo guarda el dato
            else
                store.add(datos)

           return await waitStatus()
    }

//  Update data
    Update = async (colection, index, valuekey, data) =>    
    {
        const waitForSucces = () => new Promise( async resolve=>{
            await this.openCursor(colection, "readwrite", ev => {
                const 
                    cursor = ev.target.result,
                    UpdateData = cursor.value //Datos iniciales
                
//              Guarda los valores
                if (cursor){

//                  Verifico la existencia de los campos para actualizarlos
                    if(cursor.value[index] == valuekey){

                        for(let i in data){
                        
                            if(UpdateData[i]){

                                UpdateData[i] = data[i]
                            }
                        }
//                      Actualizao los datos
                        const request = cursor.update(UpdateData)
                    
//                      Si todo resulto correcto devuelvo true
                        request.onsuccess = e => {
                            resolve(true)
                        }
                    }else{ 
                        cursor.continue()
                    }            
                }else{ 
                    
                    resolve({404: "Nothing to show"})
                }
            })
        })

        return await waitForSucces()
    }
    Delete = async (collection, index, value, length = 1)=>{
        
        let contador = 1

        length = typeof length == "number" ? length : 1

        const waitForSucces = () => new Promise(resolve => {
            
            this.openCursor(collection, "readwrite", e => {

                let result = e.target.result
        
//              When the results finish, finish the promise and return them
                if(result == null){

                    resolve(`${contador - 1} elements delete`)
                    return
                }

//              Validate and add the results that have the index and value
                if(result.value[index] == value)
                    
                    if(length == 0)
                    {
                       contador++     
                       let Result = result.delete()

                    }else if(length >= contador)
                    {

                        contador++
                        let Result = result.delete()
                           
                    }

                result.continue()
            })   
        })
        return await waitForSucces()
    }
    DeleteDB = async ()=>{
        const deletedb = () =>new Promise(resolve => indexedDB.deleteDatabase(this.name).onsuccess = e=>  resolve(true, e))
        return await deletedb()
    }
}