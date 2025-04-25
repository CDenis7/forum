const db = require('../config/database');
const bcrypt = require('bcrypt');

const userModel = {
  // Creează un utilizator nou
  async create(userData) {
    const { username, email, password } = userData;
    
    // Hash parola
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at, karma, avatar_url
    `;
    
    const values = [username, email, hashedPassword];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  
  // Găsește un utilizator după email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  },
  
  // Găsește un utilizator după ID
  async findById(id) {
    const query = `
      SELECT id, username, email, created_at, karma, avatar_url
      FROM users WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
  
  // Actualizează profilul utilizatorului
  async updateProfile(id, userData) {
    const { username, avatar_url } = userData;
    
    const query = `
      UPDATE users
      SET username = COALESCE($1, username),
          avatar_url = COALESCE($2, avatar_url)
      WHERE id = $3
      RETURNING id, username, email, created_at, karma, avatar_url
    `;
    
    const values = [username, avatar_url, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }
};

module.exports = userModel;