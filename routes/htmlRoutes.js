var db = require("../models");

module.exports = function (app) {
  // Load login page
  app.get("/", function (req, res) {
    db.Example.findAll({}).then(function (icebreak_r_test) {
      res.render("login", {});
    });
  });
  // Chat page
  app.get("/chat", function (req, res) {
    db.Example.findAll({}).then(function (icebreak_r_test) {
      res.render("group_chat", {});
    });
  });
  // Profile page
  app.get("/profile", function (req, res) {
    db.Example.findAll({}).then(function (icebreak_r_test) {
      res.render("profile", {});
    });
  });
  // Profile page
  app.get("/quiz", function (req, res) {
    db.Example.findAll({}).then(function (icebreak_r_test) {
      res.render("quiz", {});
    });
  });
  // Group page
  app.get("/group", function (req, res) {
    db.Example.findAll({}).then(function (icebreak_r_test) {
      res.render("group", {});
    });
  });
  // socializing options page
  app.get("/option", function (req, res) {
    db.Example.findAll({}).then(function (icebreak_r_test) {
      res.render("socializing", {});
    });
  });
  // Chat questions test page
  app.get("/questions", function (req, res) {
    db.Example.findAll({}).then(function (icebreak_r_test) {
      res.render("questions", {});
    });
  });
  


  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function (icebreak_r_test) {
      res.render("example", {
        example: icebreak_r_test
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
