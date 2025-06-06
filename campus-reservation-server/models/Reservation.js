const BaseModel = require('./BaseModel');

class Reservation extends BaseModel {
  constructor() {
    super('reservations');
  }

  async create(reservationData) {
    const reservation = {
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return super.create(reservation);
  }

  async findByUserId(userId) {
    return this.findByField('userId', userId);
  }

  async findByRoomId(roomId) {
    return this.findByField('roomId', roomId);
  }

  async findByDateRange(startDate, endDate) {
    const snapshot = await this.collection
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async findByStatus(status) {
    return this.findByField('status', status);
  }
}

module.exports = new Reservation();
