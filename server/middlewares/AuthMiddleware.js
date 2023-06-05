//middleware that we put inside router.post("/", MIDDLEWARE, (res, req))
// to check whether the token is valid or not
const {verify} =  require('jsonwebtoken')


const validateToken = (req, res, next) => {

  const authHeader = req.headers.authorization;
  console.log("This is the authHeader: " + authHeader )

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token not found or invalid' }).end();
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const decoded = verify(accessToken, 'access');
    req.userId = decoded.userId
    req.roleId = decoded.roleId // Attach userId to the request object
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid access token' }).end();
  }
}


module.exports = { validateToken }
