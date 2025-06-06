const { db } = require('./firebase');

const connectDB = async () => {
  try {
    // Vérifier la connexion à Firestore
    await db.collection('test').doc('test').get();
    console.log('Firestore connecté avec succès');
  } catch (error) {
    console.error(`Erreur de connexion à Firestore: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, db };
