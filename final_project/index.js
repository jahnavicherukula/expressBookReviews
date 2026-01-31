const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// 🔐 Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {

  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization.accessToken;

  jwt.verify(token, "fingerprint_customer", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // make user info available in routes
    next();
  });

});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
