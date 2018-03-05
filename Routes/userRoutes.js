const router = require("express").Router();
const expressValidation = require("express-validation");

const userController = require("../controllers/user.controllers");
const userValidator = require("../models/userValidationModel");
const { authLocal, authJWT } = require("../services/auth.services");

router.post("/signup", expressValidation(userValidator.signup), (req, res) =>
  userController.signup(req, res)
);

router.post("/login", authLocal, (req, res, next) =>
  userController.login(req, res, next)
);

router.get("/bookmarks", authJWT, (req, res) =>
  userController.getBookmarkedPosts(req, res)
);

router.get("/:id/bookmarks", authJWT, (req, res) =>
  userController.getOneBookmarkedPost(req, res)
);

module.exports = router;
