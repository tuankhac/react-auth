/*
lib
*/
const jwt = require('jsonwebtoken');

/*
custom lib
*/

/*
declare
*/
const saltRounds = 10;
const secret = 'mysecret';
module.exports = Common;
function Common(options) {
}
Common.token = function token(req, res) {
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        let username = decoded.username;
        return res.send(username);
        next();
      }
    });
  }
};
