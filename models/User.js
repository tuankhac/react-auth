const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const secret = 'mysecret';

module.exports = User;
function User(options) {
}
User.register = function (connection, req, res) {
  const { username, password } = req.body;
  var sql = "insert into user_info(username,password) values(?,?)";
  var param = [username, password];
  connection.query(sql, param, function (err, results) {
    if (err) {
      return res.json({ user: err });
    }
    return res.json({ user: results });
  });
};

User.authenticate = function (mySQL,connection, req, res) {
  const { username, password } = req.body;
  var param = [username];
  var sql = "select * from user_info where username = ?";
  sql = mySQL.format(sql,param);
  connection.query(sql, function (err,results) {
    if (err) {
      return res.json({ user: err }).sendStatus(401);
    }
    let user = results[0];
    bcrypt.compare(password, user.password, function (err, same) {
      if (err) {
        res.status(500)
          .json({
            error: 'Internal error please try again'
          });
      } else if (!same) {
        res.status(401)
          .json({
            error: 'Incorrect username or password'
          });
      } else {
        // Issue token
        const payload = { username };
        const token = jwt.sign(payload, secret, {
          expiresIn: '1h'
        });
        //req.session.cookie('token', token, { httpOnly: true });
        res.cookie('token', token, { httpOnly: true}).sendStatus(200).send();
      }
    });
  });
};

User.getUserInfo = function (connection, req, res) {
  const { username} = req.query;
  var param = [username];
  var sql = "select * from user_info where username = ?";
  let user ;
  connection.query(sql, param, function (err, results) {
    if (err) {
      return res.json(err);
    }
    user = results[0];
    return res.json(user);
  });
};