const { admin } = require('../config/firebase')
const { setSaldoChaim } = require('./saldo')
const db = admin.firestore()

const NewSorteo = async(sorteoData)=>{
    //console.log(sorteoData)
    const arrayPuesto = []
    for(let i = 1; i<=sorteoData.formData.puestos; i++){
        const numero = i.toString().padStart(sorteoData.formData.puestos.toString().length,'0')
        arrayPuesto.push({[numero]:''})
    }
    try{
        // Guarda el documento con un ID automático
        const docRef = await db.collection('sorteos').add({
            premio: sorteoData.formData.premio,
            valor: sorteoData.formData.valor,
            puestos: sorteoData.formData.puestos,
            urlImg: sorteoData.fileUrl,
            // Si 'puestos' es una estructura más compleja (e.g., un array), lo puedes incluir aquí
            arryPuestos: arrayPuesto   // Ejemplo: Array de puestos
        });

        //console.log('Sorteo guardado con ID:', docRef.id);
        return { success: true, message: 'Sorteo guardado correctamente', id: docRef.id };
    
    }catch (error) {
        //console.error('Error al guardar el sorteo:', error);
        return { success: false, message: error.message };
    }
}
const eliminarSorteo = async (idSorteo) => {
    try {
        // Eliminar el documento de la colección 'sorteos' con el ID especificado
        await db.collection('sorteos').doc(idSorteo).delete();
        //console.log(`Sorteo con ID ${idSorteo} eliminado correctamente.`);
        return { success: true, message: 'Sorteo eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar el sorteo:', error);
        return { success: false, message: error.message };
    }
};
// Función para comprar números
const comprarNumeros = async (data) => {
    try {
      const docRef = db.collection('sorteos').doc(data.id);
      const doc = await docRef.get();
  
      if (doc.exists) {
        const datadoc = doc.data();
        const arrayPuestos = datadoc['arryPuestos'];
        
        // Actualizar el array de puestos asignando los seleccionados al uid del usuario
        const newArrayPuesto = arrayPuestos.map(obj => {
          const clave = Object.keys(obj)[0];
          if (data.seleccionados.includes(clave)) {
            return { [clave]: data.uid };
          }
          return obj;
        });
        
        // Actualizar los puestos en la base de datos
        await db.collection('sorteos').doc(data.id).update({
          'arryPuestos': newArrayPuesto
        });
        
        // Obtener el usuario de Firebase Authentication
        const userRecord = await admin.auth().getUser(data.uid);
        
        // Calcular el pago
        const pago = datadoc['valor'] * data.seleccionados.length;
        const saldoActual = userRecord.customClaims.saldo || 0;
  
        // Validar si el usuario tiene saldo suficiente
        if (saldoActual < pago) {
          return { success: false, message: 'Saldo insuficiente para completar la compra' };
        }
  
        // Actualizar el saldo del usuario
        const newSaldo = saldoActual - pago;
        await setSaldoChaim(data.uid, newSaldo);
  
        return { success: true, message: 'Números asignados correctamente', newSaldo: newSaldo };
      }
  
      return { success: false, message: 'El sorteo no existe' };
    } catch (error) {
      console.error('Error al comprar números:', error);
      return { success: false, message: 'Ocurrió un error al procesar la compra', error };
    }
  };
  
    


module.exports = {NewSorteo, eliminarSorteo, comprarNumeros}