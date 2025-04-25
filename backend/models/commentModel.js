const db = require('../config/database');

const commentModel = {
  // Creează un comentariu nou
  async create(commentData) {
    const { content, user_id, post_id, parent_comment_id } = commentData;
    
    const query = `
      INSERT INTO comments (content, user_id, post_id, parent_comment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [content, user_id, post_id, parent_comment_id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  
  // Găsește comentarii după ID postare
  async findByPostId(postId) {
    const query = `
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY 
        CASE WHEN c.parent_comment_id IS NULL THEN c.created_at END DESC,
        CASE WHEN c.parent_comment_id IS NOT NULL THEN c.created_at END ASC
    `;
    
    const result = await db.query(query, [postId]);
    return result.rows;
  },
  
  // Votează un comentariu
  async vote(commentId, userId, voteType) {
    // Verifică dacă utilizatorul a votat deja
    const checkQuery = `
      SELECT * FROM comment_votes
      WHERE comment_id = $1 AND user_id = $2
    `;
    
    const checkResult = await db.query(checkQuery, [commentId, userId]);
    
    if (checkResult.rows.length > 0) {
      // Actualizează votul existent
      const updateQuery = `
        UPDATE comment_votes
        SET vote_type = $3
        WHERE comment_id = $1 AND user_id = $2
        RETURNING *
      `;
      
      await db.query(updateQuery, [commentId, userId, voteType]);
    } else {
      // Adaugă un vot nou
      const insertQuery = `
        INSERT INTO comment_votes (comment_id, user_id, vote_type)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      await db.query(insertQuery, [commentId, userId, voteType]);
    }
    
    // Actualizează contorul de voturi pentru comentariu
    const updateCommentQuery = `
      UPDATE comments
      SET upvotes = (SELECT COUNT(*) FROM comment_votes WHERE comment_id = $1 AND vote_type = 1),
          downvotes = (SELECT COUNT(*) FROM comment_votes WHERE comment_id = $1 AND vote_type = -1)
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(updateCommentQuery, [commentId]);
    return result.rows[0];
  }
};

module.exports = commentModel;