const { globalError, ClientError } = require("shokhijakhon-error-handler");
const { parseAccessToken } = require("../lib/jwt.service");

module.exports = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw new ClientError("Unauthorized", 401);
    const tokenType = auth.split(" ")[0];
    let accesToken = auth.split(" ")[1];
    if (tokenType != "Bearer" || !accesToken)
      throw new ClientError("Forbidden request", 403);
    let parseToken = parseAccessToken(accesToken);
    req.user = parseToken;
    return next();
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKEN EXPIRED",
        message: "Access token expired",
      });
    }
    return globalError(err, res);
  }
};
