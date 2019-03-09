var db = require("../models");

module.exports = function (app) {
  // Load login page
  app.get("/", function (req, res) {
    res.render("login", {});
  });
  // Chat page
  app.get("/chat", function (req, res) {
    res.render("group_chat", {});
  });
  app.get("/privateChat", function (req, res) {
    res.render("privateChat", {});
  });
  // Profile page
  app.get("/profile", function (req, res) {
    res.render("profile", {});
  });
  // Quiz page
  app.get("/quiz", function (req, res) {
    res.render("quiz", {});
  });
  // Group page
  app.get("/group", function (req, res) {
    res.render("group", {});
  });
  // socializing options page
  app.get("/option", function (req, res) {
    res.render("socializing", {});
  });
  // Chat questions test page
  app.get("/questions", function (req, res) {
    res.render("questions", {});
  });
   // Chat questions test page
   app.get("/signup", function (req, res) {
    res.render("signup", {});
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
