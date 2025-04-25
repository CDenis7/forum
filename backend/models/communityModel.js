const db = require('../config/database');

const communityModel = {
  // Creează o comunitate nouă
  async create(communityData) {
    const { name, description, creator_id } = communityData;
    
    const query = `
      INSERT INTO communities (name, description, creator_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [name, description, creator_id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  
  // Găsește toate comunitățile
  async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT c.*, COUNT(cm.user_id) as member_count
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  },
  
  // Găsește o comunitate după ID
  async findById(id) {
    const query = `
      SELECT c.*, COUNT(cm.user_id) as member_count
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
  
  // Găsește o comunitate după nume
  async findByName(name) {
    const query = `
      SELECT c.*, COUNT(cm.user_id) as member_count
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id
      WHERE c.name = $1
      GROUP BY c.id
    `;
    
    const result = await db.query(query, [name]);
    return result.rows[0];
  },
  
  // Adaugă un membru la comunitate
  async addMember(communityId, userId) {
    const query = `
      INSERT INTO community_members (community_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, community_id) DO NOTHING
      RETURNING *
    `;
    
    const result = await db.query(query, [communityId, userId]);
    return result.rows[0];
  },
  
  // Șterge un membru din comunitate
  async removeMember(communityId, userId) {
    const query = `
      DELETE FROM community_members
      WHERE community_id = $1 AND user_id = $2
      RETURNING *
    `;
    
    const result = await db.query(query, [communityId, userId]);
    return result.rows[0];
  }
};

module.exports = communityModel;