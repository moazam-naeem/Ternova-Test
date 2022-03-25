const jwtDecode = require("jwt-decode");

exports.ensureAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ status: "error", message: "TokenMissing" });
  }

  const token = req.headers.authorization;

  let payload = null;
  try {
    payload = jwtDecode(token, { header: true });
    next();
  } catch (err) {
    return res.status(401).send({ status: "error", message: err });
  }
};
