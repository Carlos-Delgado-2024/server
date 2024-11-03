const { admin } = require('../config/firebase')
const db = admin.firestore()

const resetExpress = async()=>{
    const result = []
    try{
        const snapshot = await db.collection('sorteos').get()
        snapshot.forEach(doc => {
            const data = doc.data()
            console.log('esto es data', data)
            // if (data.typeLot === 'Express'){
            //     result.push(data)
            // }
        })
    }catch (error) {
        console.error('Error al obtener documentos:', error);
        throw error; // Manejo de errores
    }
    // result.map(async(sorteo)=>{
    //     const ArrayPuestos = []
    //     for(let i = 0; i <= sorteo.puestos-1;i++){
    //         const numero = i.toString().padStart(sorteo.puestos.toString().length-1,'0')
    //         ArrayPuestos.push({[numero]:''})
    //     }
    //     await db.collection('sorteos').doc(sorteo.id).update({
    //         'arryPuestos': ArrayPuestos,
    //         'ganador':''
    //     })
    // })
}
module.exports = {resetExpress}