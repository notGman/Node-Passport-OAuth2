const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
require("./auth");

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.session());

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  // res.status(200).json({message:"Server up and running."})
  // res.sendFile(__dirname + "/index.html");
  res.render('index');
});

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", (req, res) => {
  res.status(400).json({ message: "Failed" });
});

app.get("/auth/protected", isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  // res.status(200).json({ message: `Hello ${name}` });
  // res.sendFile(__dirname + "/protected.html");
  res.render('protected',{name});
});

app.get("/auth/logout", (req, res) => {
  req.session.destroy();
  req.logout(()=>{
    res.redirect('/')
  });
});

app.listen(5000, () => {
  console.log(`Server runnig in http://localhost:5000`);
});
