const { admin } = require('../config/firebase')
const db = admin.firestore()

const resetExpress = async()=>{
    try{
        const snapshot = await db.collection('sorteos').get()
        snapshot.forEach(async(doc) => {
            const data = doc.data()
            // console.log('esto es data', data)
            if (data.typeLot === 'Express'){
                const ArrayPuestos = []
                for(let i = 0; i <= data.puestos-1;i++){
                    const numero = i.toString().padStart(data.puestos.toString().length-1,'0')
                    ArrayPuestos.push({[numero]:''})
                }
                await db.collection('sorteos').doc(doc.id).update({
                    'arryPuestos': ArrayPuestos,
                    'ganador':''
                })

            }
        })

    }catch (error) {
        console.error('Error al obtener documentos:', error);
        throw error; // Manejo de errores
    }
    
}
module.exports = {resetExpress}