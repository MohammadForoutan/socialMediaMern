const jwt = require('jsonwebtoken');

exports.verify = async(req,res,next) => {
  let accessToken = req.cookies.jwt;

  if(!accessToken) {
    return res.status(403).send();
  }


  try {
    payload = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    req.payload = payload;
    next();
  } catch (err) {
    return res.status(401).json("no authorization");
  }
}