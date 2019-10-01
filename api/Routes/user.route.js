// user.route.js

const express = require('express');
const app = express();
const userRoutes = express.Router();

let User = require('../models/User');

// Defined store route
userRoutes.route('/add').post(function (req, res) {
  let user = new User(req.body);
  user.save()
    .then(user => {
      res.status(200).json({'User': 'User has been added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});





module.exports = userRoutes;
