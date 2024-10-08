const http = require('http');
const { Server } = require('socket.io');
const { BuscarCollection, listenChanges} = require('./functions/collection')
const { Login } = require('./functions/login')
const { setAdminRole } = require('./functions/newAdmin')
const listAllUsers = require('./functions/listAllUsers')
const { suspendUserAccount, enableUserAccount } = require('./functions/suspen-enable')
const { setSaldoChaim } = require('./functions/saldo')
const { NewSorteo, eliminarSorteo } = require('./functions/sorteos')

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
//setAdminRole('FWdTFhP1S8NbKisCboxdK3o1UEH2')
// Manejar la conexión con Socket.IO
io.on('connection', async(socket) => {
    console.log('Un usuario se ha conectado');
    //datos de empresa
    // const empresa = await BuscarCollection('empresa')
    // socket.emit('CollectionEmpresa', empresa);  // Enviar el número de vuelta al cliente
    // listenChanges('empresa',io)
    //datos de sorteo
    // const sorteos = await BuscarCollection('sorteos')
    // socket.emit('CollectionSorteos', sorteos)
    // listenChanges('sorteos',io)
    socket.on('authToken',async({token})=>{
      Login(token,socket)
    })
    listAllUsers().then(users => {
      socket.emit('Users',users)
    })
    socket.on('suspen',async({id})=>{
      const response = await suspendUserAccount(id)
      //console.log('estos es response',response)
      socket.emit('ResponsSupen',response)
    })
    socket.on('enable',async({id})=>{
      const response = await enableUserAccount(id)
      socket.emit('ResponseEnable',response)
    })
    socket.on('newSaldo',(id)=>{
      const response = setSaldoChaim(id,0)
      console.log('esto es response:',response)
    })
    socket.on('newSorteo',(data)=>{
      NewSorteo(data).then(result => {
        socket.emit('ResponseSorteo',result.message)
      })
    })
    socket.on('eliminarSorteo',(id)=>{
      eliminarSorteo(id).then(result => {
        socket.emit('ResponseSorteo',result.message)
      })
    })
    



  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
    });
});

// Iniciar el servidor en el puerto 3000
server.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto: ',PORT);
});
