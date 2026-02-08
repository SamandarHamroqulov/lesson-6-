const { sign, verify } = require("jsonwebtoken");

module.exports = {
    createAccessToken: (payload) => sign(payload, process.env.MY_SECRET_KEY, {expiresIn: "5m"}),
    parseAccessToken: (token) => verify(token, process.env.MY_SECRET_KEY),
    createVerifyToken: (payload) => sign(payload, process.env.MY_SECRET_KEY, {expiresIn: "15m"}),
    parseVerifyToken: (token) => verify(token, process.env.MY_SECRET_KEY),
    createResetLinkToken: (payload) => sign(payload, process.env.MY_SECRET_KEY,{expiresIn: "15m"}),
    createForgotpassToken: (payload) => sign(payload, process.env.MY_SECRET_KEY, {expiresIn: "15m"}),
    parseForgotpassToekn: (token) => verify(token, process.env.MY_SECRET_KEY),
    createRefreshToken: (payload) => sign(payload, process.env.MY_SECRET_REFRESH_KEY, {expiresIn: "90d"}),
    parseRefreshToken: (token) => verify(token, process.env.MY_SECRET_REFRESH_KEY),
}