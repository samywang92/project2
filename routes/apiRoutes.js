// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the posts
  app.get("/api/posts/", function (req, res) {
    db.Post.findAll({})
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for returning posts of a specific category
  app.get("/api/posts/category/:category", function (req, res) {
    db.Post.findAll({
      where: {
        category: req.params.category
      }
    })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for retrieving a single post
  // app.get("/api/posts/:id", function (req, res) {
  //   db.Post.findOne({
  //     where: {
  //       id: req.params.id
  //     }
  //   })
  //     .then(function (dbPost) {
  //       res.json(dbPost);
  //     });
  // });

//////// get route for retrieving 
  app.get("/api/posts/:email", function (req, res) {
    db.Post.findOne({
      where: {
        email: req.params.email
      }
    })
      .then(function (dbPost) {
        res.json(dbPost);
        console.log('postDB :'+ dbPost)
      });
  });

  app.get("/api/users/:uid", function (req, res) {
    db.Post.findOne({
      where: {
        userID: req.params.uid
      }
    })
      .then(function (dbPost) {
        res.json(dbPost);
        console.log('postDB :'+ dbPost)
      }).catch(function(err) {
        console.error(err);
      });
  });

  // POST route for saving a new post
  app.post("/api/posts", function (req, res) {
    console.log(req.body);
    db.Post.create({
      actualName: req.body.actualName,
      displayName: req.body.displayName,
      email: req.body.email,
      picture: req.body.picture,
      userID: req.body.userID
    })

      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function (req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // PUT route for updating posts
  app.put("/api/posts", function (req, res) {
    db.Post.update(req.body,
      {
        where: {
          id: req.body.id
        }
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });
};
