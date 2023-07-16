export const privacy = (privacyType) => {
  return (req, res, next) => {
    const user = req.user;
    switch (privacyType) {
      case "PRIVATE":
        if (user) next();
        else res.redirect("/login");
        break;

      case "NO_AUTHENTICATED":
        if (!user) next();
        else res.redirect("/products");
        break;
    }
  };
};

export const authRole = (role) => {
  return async (req, res, next) => {
    
  };
};