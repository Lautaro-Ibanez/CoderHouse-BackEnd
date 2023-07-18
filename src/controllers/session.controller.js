const registerResponse = (req, res) => {
  res.sendSucces("successful registration");
};

const login = (req, res) => {
  const token = generateToken(req.user);
  res
    .cookie("authToken", token, {
      maxAge: 1000 * 3600 * 6,
      httpOnly: true,
    })
    .sendSuccess("Logged In");
};

const getCurrentUser = (req, res) => {
  res.send({ status: "success", payload: req.user });
};

const logout = (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/login");
};

const gitCreateUser = (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cartId,
  };
  const accesToken = generateToken(user);
  console.log(user);

  res
    .cookie("authToken", accesToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    })
    .redirect("/products");
};

export default {
  registerResponse,
  login,
  getCurrentUser,
  logout,
  gitCreateUser,
};
