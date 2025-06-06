const BaseModel = require('./BaseModel');

class Floor extends BaseModel {
  constructor() {
    super('floors');
  }

  async create(floorData) {
    const floor = {
      ...floorData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return super.create(floor);
  }

  async findByFloorNumber(floorNumber) {
    const floors = await this.findByField('floorNumber', floorNumber);
    return floors[0] || null;
  }

  async updateRoomStatus(floorId, roomId, status) {
    const floor = await this.findById(floorId);
    if (!floor) return null;

    const elements = floor.elements.map(element => {
      if (element.id === roomId) {
        return { ...element, status };
      }
      return element;
    });

    return this.update(floorId, { elements });
  }

  async getAllRooms() {
    const floors = await this.findAll();
    return floors.reduce((rooms, floor) => {
      const floorRooms = floor.elements
        .filter(element => element.type === 'room')
        .map(room => ({
          ...room,
          floorNumber: floor.floorNumber,
          floorName: floor.name
        }));
      return [...rooms, ...floorRooms];
    }, []);
  }
}

module.exports = new Floor();
