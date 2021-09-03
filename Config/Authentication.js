exports.verifyToken = (req, res, next) => {
  let token = localStorage.getItem("Token");
  if (token !== "undefined") {
    req.token = token;
    next();
  } else {
    res.json({ error: "Access Dined" });
  }
};
