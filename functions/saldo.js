const { admin } = require('../config/firebase')

const setSaldoChaim = async (uid, saldo)=>{
    try{
        await admin.auth().setCustomUserClaims(uid, { saldo: saldo });
        return { success: true, message: 'Saldo asignado correctamente' };
    }catch (error) {
        console.error('Error al asignar el saldo:', error);
        return { success: false, message: error.message };
    }
}
module.exports = {setSaldoChaim}