const http = require('http');
const { Server } = require('socket.io');
const {BuscarCollection, listenChanges} = require('./functions/collection')
const PORT = process.env.PORT || 5000

// Crear el servidor HTTP
const server = http.createServer();

// Configuración de CORS para permitir solo ciertas URL
const io = new Server(server, {
  cors: {
    origin: ['https://megaloto-vfinal.web.app', 'http://localhost:3000'],  // URLs permitidas
    methods: ['GET', 'POST'],  // Métodos permitidos
  }
});

// Manejar la conexión con Socket.IO
io.on('connection', async(socket) => {
    console.log('Un usuario se ha conectado');
    //datos de empresa
    const empresa = await BuscarCollection('empresa')
    socket.emit('CollectionEmpresa', empresa);  
    listenChanges('empresa',io)
    //datos de sorteo
    const sorteos = await BuscarCollection('sorteos')
    socket.emit('CollectionSorteos', sorteos)
    listenChanges('sorteos',io)



  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
    });
});

// Iniciar el servidor en el puerto 3000
server.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto: ',PORT);
});
