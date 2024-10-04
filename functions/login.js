const { admin } = require('../config/firebase')

const Login = async(token,socket)=>{
    try {
        // Verificar el token
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Verificar si el usuario tiene la custom claim de admin
        if (decodedToken.admin === true) {
            //console.log('El usuario es un administrador');
            socket.emit('authResponse', { success: true, isAdmin: true });
        } else {
            //console.log('El usuario NO es un administrador');
            socket.emit('authResponse', { success: true, isAdmin: false });
        }
    } catch (error) {
        //console.error('Error al verificar el token:', error);
        socket.emit('authResponse', { success: false, message: error.message });
    }
}
module.exports={Login}