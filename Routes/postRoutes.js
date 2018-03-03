const router = require("express").Router();
const expressValidator = require("express-validation");
const postValidator = require("../models/postValidationModel");
const { authJWT } = require("../services/auth.services");
const postController = require("../controllers/post.controller");

router.post(
  "/",
  authJWT,
  expressValidator(postValidator.createPost),
  (req, res) => postController.createPost(req, res)
);

router.get("/:postId", authJWT, (req, res) =>
  postController.getPostById(req, res)
);

router.get("/", authJWT, (req, res) => postController.getAllPosts(req, res));

router.patch(
  "/:postId",
  authJWT,
  expressValidator(postValidator.updatePost),
  (req, res) => postController.updatePost(req, res)
);

router.delete("/:postId", authJWT, (req, res) =>
  postController.deletePost(req, res)
);

router.post("/:id/likes", authJWT, (req, res) =>
  postController.likedPost(req, res)
);

module.exports = router;
