const dotenv = require("dotenv");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const morgan = require("morgan");
const http = require("http");
const express_session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
app.use(express.static(__dirname + "/public"));
const mongoose = require("mongoose");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

dotenv.config();

app.use(
  express_session({
    secret: "geeksforgeeks",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(methodOverride("_method"));
app.use(flash());

app.use(morgan("dev"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let pass = process.env.password;

mongoose.connect(
  `mongodb+srv://hacker:${pass}@test.dajmv.mongodb.net/shoppingApp?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (!err) {
      console.log("Cloud MongoDB Connected");
    } else {
      console.log("Err" + err);
    }
  }
);

app.use("/", require("./routers/User"));

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const server = http.createServer(app);
let port = process.env.PORT || 5000;
server.listen(port, (err) => {
  if (!err) {
    console.log(`Server Running at ${port}`);
  } else {
    console.log("Error " + err);
  }
});
