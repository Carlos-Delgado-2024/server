const { admin } = require('../config/firebase')
const db = admin.firestore()

const setSaldoChaim = async (uid, saldo)=>{
    try{
        await admin.auth().setCustomUserClaims(uid, { saldo: saldo });
        return { success: true, message: 'Saldo asignado correctamente', saldo };
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
        return { success: true, message: 'Ticket eliminado correctamente', uid:data.uid};
    }catch (error) {
        //console.error('Error al guardar el sorteo:', error);
        return { success: false, message: error.message };
    }
}
const soliCancelada = async(data)=>{
    try{
        await db.collection('CargaNequi').doc(data.id).update({
            motivo:data.motivo,
            state:'Cancelada'
        })
        return { success: true, message: 'Solicitud marcada como CANCELADA'}
    }catch (error) {
        return { success: false, message: error.message };
    }
}

const soliModificada = async(data)=>{
    try{
        await db.collection('CargaNequi').doc(data.id).update({
            montoCarga:data.monto
        })
        return { success: true, message: 'Solicitud modificada con exito'}
    }catch (error) {
        return { success: false, message: error.message };
    }
}
const soliAprobada = async(id)=>{
    try{
        const docRef = db.collection('CargaNequi').doc(id)
        const doc = await docRef.get()
        const data = doc.data()
        const user = await admin.auth().getUser(data.uid);
        await db.collection('CargaNequi').doc(id).update({
            state:'Aprobada'
        })
        const newSaldo = Number(data.montoCarga) + Number(user.customClaims.saldo)
        const x = await setSaldoChaim(data.uid, newSaldo).then(response=>{
            return response
        })
        return x

    }catch (error) {
        return { success: false, message: error.message };
    }
}
module.exports = {
    setSaldoChaim, 
    newCargaNequi,
    eliminarRecargaNequi,
    soliCancelada, 
    soliModificada,
    soliAprobada,
}