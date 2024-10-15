const { admin } = require('../config/firebase');
const { setSaldoChaim } = require('./saldo');
const listAllUsers = require('./listAllUsers');


const Login = async (token, socket, io) => {
    try {
        // Verificar el token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Si el usuario es nuevo y no tiene saldo, asignar saldo 0
        if (!decodedToken.saldo) {
            await setSaldoChaim(decodedToken.uid, 0); // Esperar a que se asigne el saldo
            //console.log(decodedToken.saldo)
            io.emit('newUser')
            const users = await listAllUsers(socket)
            io.emit('dataUserUodate',users)

        } else {
            console.log('Saldo del usuario:', decodedToken.saldo);
        }

        // Verificar si el usuario tiene la custom claim de admin
        if (decodedToken.admin === true) {
            console.log('El usuario es un administrador');
            socket.emit('authResponse', { success: true, isAdmin: true });
        } else {
            // console.log('El usuario NO es un administrador');
            socket.emit('authResponse', { success: true, isAdmin: false });
        }
    } catch (error) {
        console.error('Error al verificar el token:', error);
        socket.emit('authResponse', { success: false, message: error.message });
    }
};

module.exports = { Login };
