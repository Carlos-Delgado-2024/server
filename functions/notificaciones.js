const { db, admin } = require('../config/firebase')

const ObtenerTokens = async(typeUser)=>{
    try{
        const snapshot = await db.collection('users').get()
        const result = []
        snapshot.forEach(doc =>{
            const data = doc.data()
            if(data.typeUser === typeUser){
                if(data.tokenMesseger){
                    result.push(data.tokenMesseger)
                }
                //---------------------------
            }
        })
        return result

    }catch(error){
        console.error('Error al obtener documentos:', error);
        throw error; // Manejo de errores
    }
}

const sendNotificationToGroup = async(typeUser)=>{
    const tokens = await ObtenerTokens(typeUser)
    const promises = tokens.map((token)=>{
        const message = {
            Notification:{
                title: 'title',
                body: 'body'
            },
            token: token
        }
        return admin.messaging().send(message)
    })
    try {
        const responses = await Promise.all(promises); // Espera a que todas las promesas se resuelvan
        console.log('Successfully sent messages:', responses);
    } catch (error) {
        console.log('Error sending message:', error);
    }



    
}    

module.exports = {sendNotificationToGroup}
