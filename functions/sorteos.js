const { admin } = require('../config/firebase')
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

module.exports = {NewSorteo, eliminarSorteo}