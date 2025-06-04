const express = require('express'),
    app = express(),
    port = 3000,
    {MongoClient, ObjectId} = require('mongodb'),
    http = require('http').createServer(app),
    io = require('socket.io')(http, {
        allowEIO3: true,
        cors: {
            origin: ["http://localhost:3000", "http://127.0.1:3000/","http://localhost:3000/"],
            allowedHeaders: ["Content-Type"],
            credential: true
        }
    }),
    url = 'mongodb://localhost:27017',
    client = new MongoClient(url),
    dbName = 'db_amigos';

io.on('connection', (socket) => {
    console.log('Chat conectado');

    socket.on('mensajeAmigo', async (mensaje) => {
        let db = await conectarMongoDb(),
            collection = db.collection('chats'),
            result = collection.insertOne({ mensaje: mensaje, fecha: new Date() });

        //socket.broadcast.emit('mensajeAmigo', mensaje); // Enviar a todos los demás clientes conectados, menos a mi mismo
        io.emit('mensajeAmigo', mensaje); // Enviar a todos los clientes conectados. Incluso a mi mismo
    });
});

app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/api/historial_chat', async (req, res) => { //listar historial de chat
    let db = await conectarMongoDb(),
        collection = db.collection('chats'),
        chats = await collection.find().sort({ fecha: 1 }).toArray();
    res.send(chats);
});
app.post('/api/amigos', async (req, res) => { //guardar nuevos amigos
    let amigo = req.body, 
        db = await conectarMongoDb(),
        collection = db.collection('amigos'),
        result = await collection.insertOne(amigo);
    res.send({msg:result});
});
app.put('/api/amigos/', async (req, res) => { //actualizar amigos
    let amigo = req.body,
        db = await conectarMongoDb(),
        collection = db.collection('amigos'),
        result = await collection.updateOne({ _id: new ObjectId(amigo.id) }, { $set: amigo });
    res.send({msg:result});
});
app.get('/api/amigos/', async (req, res) => { //listar amigos
    let buscar = req.query.buscar,
        db = await conectarMongoDb(),
        collection = db.collection('amigos'),
        amigos = await collection.find({
            $or: [
                { nombre: { $regex: new RegExp(buscar, 'i') } }, 
                { telefono: { $regex: new RegExp(buscar, 'i') } }, 
                { email: { $regex: new RegExp(buscar, 'i') } }
            ]
        }).limit(5).toArray();
    res.send(amigos);
});
app.delete('/api/amigos/:id', async (req, res) => { //eliminar amigos
    let id = req.params.id, 
        db = await conectarMongoDb(),
        collection = db.collection('amigos'),
        result = await collection.deleteOne({ _id: new ObjectId(id) });
    res.send({msg:result});
});
http.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});
async function conectarMongoDb(){
    await client.connect();
    return client.db(dbName);
}