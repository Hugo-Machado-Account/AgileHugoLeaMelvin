const BaseModel = require('./BaseModel');
const bcrypt = require('bcrypt');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  async create(userData) {
    // Hacher le mot de passe avant de sauvegarder
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = {
      ...userData,
      password: hashedPassword,
      isActive: true,
      lastLogin: null
    };

    return super.create(user);
  }

  async findByUsername(username) {
    const users = await this.findByField('username', username);
    return users[0] || null;
  }

  async findByEmail(email) {
    const users = await this.findByField('email', email);
    return users[0] || null;
  }

  async comparePassword(userId, candidatePassword) {
    const user = await this.findById(userId);
    if (!user) return false;
    return bcrypt.compare(candidatePassword, user.password);
  }

  async updateLastLogin(userId) {
    return this.update(userId, { lastLogin: new Date() });
  }
}

module.exports = new User();
