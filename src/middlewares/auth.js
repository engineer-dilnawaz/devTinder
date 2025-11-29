const adminAuth = (req, res, next) => {
  const reqToken = "abc";
  const isAuthorized = reqToken === "abc";

  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
