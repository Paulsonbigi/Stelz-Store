const User = require("../model/user.model");
const gravatar = require("gravatar");
const normalizeUrl = require("normalize-url");
const crypto = require("crypto");
const Email = require("../utils/sendEmail");

const sendToken = async (user, res, statusCode) => {
  const token = await user.getJwtToken();
  const cookieOption = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 1000),
  };
  if (process.env.NODE_ENV === "production") {
    // only on https else user won't be assigned any cookie
    cookieOption.secure = true;
  }
  user.firstName = user.fullName.split(" ").slice(0, -1).join(" ");
  user.password = undefined;

  res.cookie("token", token, cookieOption).status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// @Route POST A USER
// @desc register new user on the database
//  @access public access
exports.registerUser = async (req, res, next) => {
  try {
    // send user a confirmation email
    const { fullName, email, phoneNumber, password, confirmPassword } =
      req.body;

    const avatar = normalizeUrl(
      gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      }),
      { forceHttps: true }
    );

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      image: avatar,
    });

    const url =
      process.env.NODE_ENV === "development"
        ? process.env.DEV_URL
        : process.env.PROD_URL;
    new Email(user, url).sendWelcome();

    sendToken(user, res, 201);
  } catch (err) {
    console.log(err);
  }
};

// @Route POST A USER
// @desc login existing user on the database
//  @access public access
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      res
        .status(404)
        .json({ success: false, msg: "You are not registered yet" });

    if (!(await user.comparePassword(password, user.password))) {
      return res.status(400).json({ success: false, msg: "Invalid password" });
    }

    sendToken(user, res, 201);
  } catch (err) {
    console.log(err);
  }
};

// @Route POST request
// @desc request for password change
//  @access public access
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

// @Route POST A USER
// @desc forgot password
//  @access public access
exports.forgotPassword = async (req, res, next) => {
  try {
    // accept user email
    const { email } = req.body;

    // check if user
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ auccess: false, msg: "User does not exist" });

    const resetToken = user.createPasswordRestToken();

    await user.save({ validateBeforeSave: false });
    const url =
      process.env.NODE_ENV === "development"
        ? `${req.protocol}://${req.get(
            "host"
          )}/forgot-password/reset/${resetToken}`
        : `process.env.PROD_URL/forgot-password/reset/${resetToken}`;
    new Email(user, url).passwordReset();

    res.status(200).json({
      success: true,
      url,
      msg: "Password reset token has been sent to your email",
    });
  } catch (err) {}
};

// @Route POST request
// @desc request for password change
//  @access private access
exports.resetPasword = async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = User.findOne({
    forgotPasswordResetToken: hashToken,
    forgotPasswordExpires: { $gt: Date.now() },
  });

  // if user does not exist
  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  (user.password = req.body.password),
    (user.confirmPassword = req.body.confirmPassword),
    (user.forgotPasswordResetToken = undefined),
    (user.forgotPasswordExpires = undefined);

  await user.save();

  const token = sign;

  res.status(202).json({ success: true, msg: "Password reset sucessfully" });
};
