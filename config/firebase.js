const admin = require('firebase-admin');
const serviceAccount = require('../megaloto-v2-firebase-adminsdk-kmmeh-6117a4894d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://megaloto-v2.firebaseio.com'
});

const db = admin.firestore();

module.exports = db;
