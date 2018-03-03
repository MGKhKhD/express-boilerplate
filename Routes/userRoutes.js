const router = require("express").Router();
const expressValidation = require("express-validation");

const userController = require("../controllers/user.controllers");
const userValidator = require("../models/userValidationModel");
const auth = require("../services/auth.services");

router.post("/signup", expressValidation(userValidator.signup), (req, res) =>
  userController.signup(req, res)
);

router.post("/login", auth.authLocal, (req, res, next) =>
  userController.login(req, res, next)
);

module.exports = router;
