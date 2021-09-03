const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../Config/Authentication");
const userSchema = require("../Models/userModal");

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let user = new userSchema({
      Username: req.body.username,
      Email: req.body.email,
      Password: hashedPassword,
    });

    user.save((err, data) => {
      if (err) {
        console.log("Error" + err);
      } else {
        console.log("Data saved");
        console.log(data);
        res.status(201).redirect("/");
      }
    });
  } catch {
    res.status(500).send();
  }
});

router.get("/home", verifyToken, (req, res) => {
  jwt.verify(req.token, "Hackmypassword", (err, authData) => {
    if (err) {
      res.redirect("/");
    } else {
      res.render("home", { name: authData.user });
    }
  });
});

router.post("/login", async (req, res) => {
  let user = await userSchema.findOne({ Email: req.body.email });

  if (user == null) {
    return res.status(200).render("login", { message: "Not Found!!" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.Password)) {
      let tokendata = await jwt.sign(
        { user: user.Username, PhoneNo: user.PhoneNo },
        "Hackmypassword",
        {
          expiresIn: "1h",
        }
      );
      localStorage.setItem("Token", tokendata);

      res.redirect("/home");
    } else {
      res.status(200).render("login", { message: "Password mismatch!" });
    }
  } catch {
    res.status(500).send();
  }
});

router.delete("/logout", (req, res) => {
  console.log("logout");
  req.session.destroy(function (err) {
    localStorage.removeItem("Token");
    res.redirect("/");
  });
});

module.exports = router;
