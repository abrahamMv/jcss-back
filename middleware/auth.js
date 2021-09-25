const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No se ha encontrado toke, acceso restringido." });
  }
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.user = cifrado.user;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid Token" });
  }
};
