const { db } = require('../config/db');

class BaseModel {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  async create(data) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async update(id, data) {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date()
    });
    return this.findById(id);
  }

  async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }

  async findByField(field, value) {
    const snapshot = await this.collection.where(field, '==', value).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}

module.exports = BaseModel; 