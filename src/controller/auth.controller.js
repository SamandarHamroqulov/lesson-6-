const { globalError, ClientError } = require("shokhijakhon-error-handler");
const {
  registerValidator,
  loginValidator,
  resendLinkOrForgotPass,
  changePasswordValidator,
} = require("../utils/validator/auth.validator");
const UserModel = require("../models/User.model");
const { hash, compare } = require("bcrypt");
const {
  createAccessToken,
  parseAccessToken,
  createResetLinkToken,
  createVerifyToken,
  parseVerifyToken,
  createForgotpassToken,
  parseForgotpassToekn,
  createRefreshToken,
  parseRefreshToken,
} = require("../lib/jwt.service");
const emailService = require("../lib/mail.service");

module.exports = {
  async REGISTER(req, res) {
    try {
      let newUser = req.body;
      await registerValidator.validateAsync(newUser);
      let checkUser = await UserModel.findOne({ email: newUser.email });
      if (checkUser) throw new ClientError("User already exsist", 400);
      newUser.password = await hash(newUser.password, 10);

      const user = await UserModel.create(newUser);
      const token = createVerifyToken({ id: user._id });
      const link = `${process.env.LINK_URL}/auth/verify/email?token=${token}`;
      await emailService(user.email, link);
      return res.status(201).json({
        message: "User succesfully registered",
        status: 201,
      });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async VERIFY(req, res) {
    try {
      let { token } = req.query;
      if (!token) throw new ClientError("Token required", 400);
      const payload = parseVerifyToken(token);
      await UserModel.findByIdAndUpdate(payload.id, { is_verified: true });
      return res.json({ message: "Email succesfully verified", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async RESEND_LINK(req, res) {
    try {
      let data = req.body;
      await resendLinkOrForgotPass.validateAsync(data);
      let findUser = await UserModel.findOne({ email: data.email });
      if (!findUser) throw new ClientError("User not found ");
      if (findUser.is_verified) throw new ClientError("User already verified");
      const token = createResetLinkToken({ id: findUser._id });

      const link = `${process.env.LINK_URL}/auth/verify/email?token=${token}`;

      await emailService(findUser.email, link);

      return res.json({
        message: "Verification link resent to email",
        status: 200,
      });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async FORGOT_PASSWORD(req, res) {
    try {
      let data = req.body;
      await resendLinkOrForgotPass.validateAsync(data);
      let findUser = await UserModel.findOne({ email: data.email });
      if (!findUser) throw new ClientError("User not found", 404);
      if (!findUser.is_verified)
        throw new ClientError("Verify your email first", 403);
      const token = createForgotpassToken({ id: findUser._id });
      const link = `${process.env.LINK_URL}/auth/reset/password?token=${token}`;
      await emailService(findUser.email, link);
      return res.json({ message: "Link sent to your email" });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async RESET_PASSWORD(req, res){
    try {
        const {token} = req.query;
        if(!token) throw new ClientError("TOken is required", 400)
            const data = req.body;
        await changePasswordValidator.validateAsync(data);
        const payload = parseForgotpassToekn(token)
        let findUser = await UserModel.findById(payload.id);
      if (!findUser) throw new ClientError("User not found", 404);
      if (!findUser.is_verified)
        throw new ClientError("Verify your email first", 403);
    let hash_password = await hash(data.new_password, 10)
     await UserModel.findByIdAndUpdate(findUser._id, {
      password: hash_password,
    });
    return res.json({message: "Password succesfully updated", status: 200})


    } catch (err) {
        return globalError(err, res)        
    }
  }
  ,
  async LOGIN(req, res) {
    try {
      let data = req.body;
      await loginValidator.validateAsync(data, { abortEarly: false });
      let findUser = await UserModel.findOne({ email: data.email });
      if (!findUser || !findUser.is_verified)
        throw new ClientError("User not found or profile not verified");
      let checkPassword = await compare(data.password, findUser.password);
      if (!checkPassword)
        throw new ClientError("Password or email incorrect", 400);
      let accessToken = createAccessToken({ sub: findUser.id });
      let refreshToken = createRefreshToken({sub: findUser.id});
      await findUser.updateOne({refresh_token: refreshToken})
      res.cookie("refresh_token", refreshToken, {
        maxAge: 86400 * 90,
        httpOnly: true
      })
      return res.json({
        message: "User succesfully logged in ",
        status: 200,
        accessToken,
      });
    } catch (err) {
      return globalError(err, res);
    }
  },
  async REFRESH(req, res) {
    try {
        let refreshToken = req.cookies.refresh_token;
    if(!refreshToken) throw new ClientError("Forbidden request", 403)
        let findUser = await UserModel.findOneAndUpdate({refresh_token: refreshToken});
    if(!findUser) throw new ClientError("Invalid refreshTOken", 403)

        let accessToken = createAccessToken({sub: findUser._id});
        return res.json({message: "Access token succesfully generated", status: 200, accessToken})

        
    } catch (err) {
        return globalError(err,  res)
        
    }
  }
};
