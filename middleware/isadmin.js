
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try{
    const token=req.header('x-auth-token');
    if(!token){
      return res.status(401).json({msg:'No token, authorization denied'});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded.user;
    if(req.user.role !== 'admin'){
      return res.status(403).json({msg:'Access denied: Admins only.'});
    }
    next();
  }catch(err){
    res.status(500).json({msg:'Server error',error:err.message});

  }
};
