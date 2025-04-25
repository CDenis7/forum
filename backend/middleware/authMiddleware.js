const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Verifică existența token-ului în header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acces neautorizat. Token necesar.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verifică validitatea token-ului
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adaugă utilizatorul la obiectul request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid sau expirat.' });
  }
};

module.exports = authMiddleware;