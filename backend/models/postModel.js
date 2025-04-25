const db = require('../config/database');

const postModel = {
  // Creează o postare nouă
  async create(postData) {
    const { title, content, user_id, community_id } = postData;
    
    const query = `
      INSERT INTO posts (title, content, user_id, community_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [title, content, user_id, community_id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  
  // Găsește toate postările
  async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT p.*, u.username, c.name as community_name, 
             COUNT(DISTINCT cm.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN communities c ON p.community_id = c.id
      LEFT JOIN comments cm ON p.id = cm.post_id
      GROUP BY p.id, u.username, c.name
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  },
  
  // Găsește postări după ID comunitate
  async findByCommunity(communityId, limit = 10, offset = 0) {
    const query = `
      SELECT p.*, u.username, c.name as community_name, 
             COUNT(DISTINCT cm.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN communities c ON p.community_id = c.id
      LEFT JOIN comments cm ON p.id = cm.post_id
      WHERE p.community_id = $1
      GROUP BY p.id, u.username, c.name
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await db.query(query, [communityId, limit, offset]);
    return result.rows;
  },
  
  // Găsește o postare după ID
  async findById(id) {
    const query = `
      SELECT p.*, u.username, c.name as community_name, 
             COUNT(DISTINCT cm.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN communities c ON p.community_id = c.id
      LEFT JOIN comments cm ON p.id = cm.post_id
      WHERE p.id = $1
      GROUP BY p.id, u.username, c.name
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
  
  // Votează o postare
  async vote(postId, userId, voteType) {
    // Verifică dacă utilizatorul a votat deja
    const checkQuery = `
      SELECT * FROM post_votes
      WHERE post_id = $1 AND user_id = $2
    `;
    
    const checkResult = await db.query(checkQuery, [postId, userId]);
    
    if (checkResult.rows.length > 0) {
      // Actualizează votul existent
      const updateQuery = `
        UPDATE post_votes
        SET vote_type = $3
        WHERE post_id = $1 AND user_id = $2
        RETURNING *
      `;
      
      await db.query(updateQuery, [postId, userId, voteType]);
    } else {
      // Adaugă un vot nou
      const insertQuery = `
        INSERT INTO post_votes (post_id, user_id, vote_type)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      await db.query(insertQuery, [postId, userId, voteType]);
    }
    
    // Actualizează contorul de voturi pentru postare
    const updatePostQuery = `
      UPDATE posts
      SET upvotes = (SELECT COUNT(*) FROM post_votes WHERE post_id = $1 AND vote_type = 1),
          downvotes = (SELECT COUNT(*) FROM post_votes WHERE post_id = $1 AND vote_type = -1)
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(updatePostQuery, [postId]);
    return result.rows[0];
  }
};

module.exports = postModel;