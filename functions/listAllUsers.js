const { admin } = require('../config/firebase')

const listAllUsers = async()=>{
    try{
        const result = await admin.auth().listUsers()
        return result.users
    }catch (error){
        console.error('Error al listar usuarios:', error)
    }
}
module.exports = listAllUsers