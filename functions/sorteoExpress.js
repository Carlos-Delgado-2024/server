const { admin } = require('../config/firebase')
const { NewSorteo } = require('./sorteos')
const db = admin.firestore()

const resetExpress = async()=>{
    try{
        const snapshot = await db.collection('sorteos').get()
        snapshot.forEach(async(doc) => {
            const data = doc.data()
            // console.log('esto es data', data)
            if (data.typeLot === 'Express'){
                if(data.userGanador){
                    await db.collection('sorteos').doc(doc.id).update({
                        'estado':'archivado'
                    })
                    const formData = {
                        premio:'acumulado',
                        valor: 1000,
                        puestos: 100,
                        urlImg: data.urlImg,
                        typeLot: 'Express',
                        premioBase: 10000
                    }
                    NewSorteo({formData})

                }
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
const initExpress = async() => {
    try{
        const snapshot = await db.collection('sorteos').get()
        snapshot.forEach(async(doc) => {
            const data = doc.data()
            // console.log('esto es data', data)
            if (data.typeLot === 'Express'){
                const numeroGanador = Math.floor(Math.random() * data.puestos).toString().padStart(data.puestos.toString().length-1,'0')
                const userGanador = data.arryPuestos[Number(numeroGanador)][numeroGanador]
                await db.collection('sorteos').doc(doc.id).update({
                    'ganador':numeroGanador,
                    'userGanador':userGanador,
                })
                if(userGanador){
                    const userRef = db.collection('users').doc(userGanador)
                    const userDoc = await userRef.get()
                    const userData = userDoc.data()
                    const newSaldo = data.premioBase + userData.saldo

                    await db.collection('users').doc(userGanador).update({
                        'saldo':newSaldo
                    })
                }

                
                

            }
        })

    }catch (error) {
        console.error('Error al obtener documentos:', error);
        throw error; // Manejo de errores
    }

}
module.exports = {resetExpress, initExpress}