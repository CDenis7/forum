const commentModel = require('../models/commentModel');

const commentController = {
  async getCommentsByPost(req, res) {
    try {
      const comments = await commentModel.findByPostId(req.params.postId);
      res.json(comments);
    } catch (error) {
      console.error('Eroare la obținerea comentariilor:', error);
      res.status(500).json({ message: 'Eroare la obținerea comentariilor.' });
    }
  },

  async createComment(req, res) {
    try {
      const { content, post_id, parent_comment_id } = req.body;
      const newComment = await commentModel.create({
        content,
        user_id: req.user.id,
        post_id,
        parent_comment_id
      });
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Eroare la crearea comentariului:', error);
      res.status(500).json({ message: 'Eroare la crearea comentariului.' });
    }
  },

  async updateComment(req, res) {
    // Would add implementation here
    res.status(501).json({ message: 'Not implemented yet' });
  },

  async deleteComment(req, res) {
    // Would add implementation here
    res.status(501).json({ message: 'Not implemented yet' });
  },

  async voteComment(req, res) {
    try {
      const { voteType } = req.body;
      const updatedComment = await commentModel.vote(req.params.id, req.user.id, voteType);
      res.json(updatedComment);
    } catch (error) {
      console.error('Eroare la votarea comentariului:', error);
      res.status(500).json({ message: 'Eroare la votarea comentariului.' });
    }
  }
};

module.exports = commentController;