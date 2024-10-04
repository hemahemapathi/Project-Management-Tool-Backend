import jwt from 'jsonwebtoken'

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT)
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export const authenticateManagerOrTeamMember = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT);
    
    if (decoded.user.role !== 'manager' && decoded.user.role !== 'team_member') {
      return res.status(403).json({ error: 'Access denied. Manager or team member role required.' });
    }
    
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const authenticateManager = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT)
    
    if (decoded.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Manager role required.' })
    }
    
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
