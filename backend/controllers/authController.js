const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

const authController = {
  // Înregistrare utilizator nou
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Validare
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
      }
      
      // Verifică dacă email-ul există deja
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email-ul este deja înregistrat.' });
      }
      
      // Creează utilizatorul
      const newUser = await userModel.create({ username, email, password });
      
      // Generează token JWT
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      res.status(201).json({
        message: 'Utilizator înregistrat cu succes',
        token,
        user: newUser
      });
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      res.status(500).json({ message: 'Eroare la înregistrare. Încearcă din nou.' });
    }
  },
  
  // Autentificare utilizator
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validare
      if (!email || !password) {
        return res.status(400).json({ message: 'Email și parolă necesare.' });
      }
      
      // Găsește utilizatorul
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email sau parolă incorectă.' });
      }
      
      // Verifică parola
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email sau parolă incorectă.' });
      }
      
      // Generează token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      res.json({
        message: 'Autentificare reușită',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
          karma: user.karma,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      res.status(500).json({ message: 'Eroare la autentificare. Încearcă din nou.' });
    }
  }
};

module.exports = authController;
