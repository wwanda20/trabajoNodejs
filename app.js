const express = require('express');  //uso express
const mongoose = require('mongoose');

const app = express (); //variable de tipo express

app.use(express.json()); //recibo informacion dentro del body es en formato json 

const uri = "mongodb+srv://wandaw:tRDjeUQEzfHOGOxZ@cluster0.y8rlu.mongodb.net/libreria?retryWrites=true&w=majority";

//conexion
async function conectar() {
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conectado a la base de datos metodo: mongoodb - async-await");
    }
    catch(e){
        console.log(e);
    }
};
conectar();


//Esquema libros
const LibroSchema = new mongoose.Schema({           //estructura que se va a guardar 
    name: String,
    author: String,
    lended: String,
    gender: {
        type: mongoose.Schema.Types.ObjectId,       //tipo de id de mongoose
        ref: 'generos',
    }

});

//Cada libro va a seguir la estructura de schema
const LibroModel = mongoose.model("libros",LibroSchema);

//CRUD
app.post('/libro', async (req, res) =>{  //Para recibir un libro
    try{
        let name = req.body.name;      //recibo en body
        let author = req.body.author;
        let lended = req.body.lended;
        let gender = req.body.gender;

        if(name === undefined){         //comprobacion de datos
            throw new Error ('No enviaste un nombre');      //creo un error
        }
        if(name == ''){         
            throw new Error ('No puede estar vacio');      
        }
        
        //author
        if(author === undefined){         
            throw new Error ('No enviaste un autor');      
        }
        if(author == ''){         
            throw new Error ('No puede estar vacio');      
        }
        
        //lended
        if(lended === undefined){         
            throw new Error ('No enviaste a quien fue prestado');    
        }
        if(lended == ''){         
            throw new Error ('No puede estar vacio');      
        }
        
        //gender
        if(gender === undefined){         
            throw new Error ('No enviaste un genero');      
        }
        if(gender == ''){         
            throw new Error ('No puede estar vacio');      
        }

        //libro ya ingresado
        let libroExiste = await LibroModel.find({name : name});     //para no repetir un libro ya cargado

        if(libroExiste.length > 0){        
            throw new Error("El libro ya fue cargado");
        }

        let libro = {
            name: name,
            author: author,
            lended: lended,
            gender:gender
        }

        let libroGuardado = await LibroModel.create(libro);
        console.log(libroGuardado);
        res.status(200).send('Libro: '+libroGuardado);
    }

    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.get('/libro', async (req, res)=>{   //dar informacion
    try{
        let listadoLibros = await LibroModel.find();
        res.status(200).send(listadoLibros); //respuesta
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});


app.get('/libro/:id', async (req, res)=>{
    try{    
        let libro = await LibroModel.findById(req.params.id); //recibo el id dentro de req.params
        res.status(200).send(libro);    //en postman va a mostrar el id
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.delete('/libro/:id', async (req, res)=>{                 //NO FUNCIONA
    try{    
        let id = req.params.id;
        await LibroModel.findByIdAndDelete(id); 
        res.status(200).send({message:"Se borró correctamente"});    
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});


app.put('/libro/:id', async (req, res)=>{                     //NO FUNCIONA
    try{
        let id = req.params.id;
        let lended = req.body.lended;
        let modificado = {
            lended:lended
        };
        
        let libroP = await LibroModel.findById(id);

        //lended
        if(lended !=''){
            if(libroP.lended =! ''){         
                throw new Error ('El libro ya fue prestado');      
            }
        }

        await LibroModel.findByIdAndUpdate(id, modificado, {new: true});    //lo busca y modifica

        res.status(200).send(modificado);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});      




//Esquema generos    
const GeneroSchema = new mongoose.Schema({           //estructura de generos
    genero: String
    
});

//Cada libro va a seguir la estructura de schema
const GeneroModel = mongoose.model("generos",GeneroSchema);

//crud
app.post('/genero', async (req, res) =>{  //Para recibir un genero
    try{
        let genero = req.body.name;      //recibo en body
        

        if(genero === undefined){         //comprobacion de datos
            throw new Error ('No enviaste un genero');      //creo un error
        }
        if(genero == ''){         
            throw new Error ('No puede estar vacio');      
        }
        
        
        //verifico si el genero ya existe
        
        let generoExiste = await GeneroModel.find({genero : genero.toUpperCase()});     //para no repetir un genero

        if(generoExiste.length > 0){        
            throw new Error("Este genero ya existe");
        }

        let generos = {
            genero: genero.toUpperCase()            //devuelve valor convertido en mayusculas
        }

        await GeneroModel.create(generos);
        console.log(generos);
        res.status(200).send(generos);
    }

    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});



app.get('/genero', async (req, res)=>{   //dar informacion
    try{
        let respuesta = null;
        respuesta = await GeneroModel.find();
        res.status(200).send(respuesta); 
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.get('/genero/:id', async (req, res)=>{
    try{    
        let idGenero = await GeneroModel.findById(req.params.id);     //busco por id
        res.status(200).send(idGenero);    
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});



app.listen(3000,()=>{
    console.log('servidor escuchado en el puerto 3000');  //servidor disponible
});