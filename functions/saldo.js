const { admin } = require('../config/firebase')
const db = admin.firestore()

const setSaldoChaim = async (uid, saldo)=>{
    try{
        await admin.auth().setCustomUserClaims(uid, { saldo: saldo });
        return { success: true, message: 'Saldo asignado correctamente' };
    }catch (error) {
        console.error('Error al asignar el saldo:', error);
        return { success: false, message: error.message };
    }
}

const newCargaNequi = async(data)=>{
    try{
        const docRef = await db.collection('CargaNequi').add({
            uid: data.formData.id,
            saldoActual: data.formData.saldo,
            montoCarga: data.formData.monto,
            fecha: data.now,
            comprobante: data.fileUrl,
            state: 'Pendiente'
        })
        return { success: true , message: 'solicitud de recarga de cuenta, enviada existosamente', uid:data.formData.id}
    }catch (error) {
        //console.error('Error al guardar el sorteo:', error);
        return { success: false, message: error.message };
    }
    
}
const eliminarRecargaNequi = async(data)=>{
    try{ 
        await db.collection('CargaNequi').doc(data.id).delete()
        console.log('estamos aca')
        return { success: true, message: 'Ticket eliminado correctamente', uid:data.uid};
    }catch (error) {
        //console.error('Error al guardar el sorteo:', error);
        return { success: false, message: error.message };
    }
}
module.exports = {setSaldoChaim, newCargaNequi,eliminarRecargaNequi}