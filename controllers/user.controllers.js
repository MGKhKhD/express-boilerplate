const httpStatus = require("http-status");
const User = require("../models/userModel");
const Post = require("../models/postModel");

module.exports = {
  signup: async function signup(req, res) {
    try {
      const user = await User.create(req.body);
      return res.status(httpStatus.CREATED).json(user.toAuthJSON());
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json(err);
    }
  },
  login: function login(req, res, next) {
    res.status(httpStatus.OK).json(req.user.toAuthJSON());
    return next();
  },
  getOneBookmarkedPost: async function getOneBookmarkedPost(req, res) {
    try {
      const promise = await Promise.all([
        User.findById(req.user._id),
        Post.findById(req.params.id)
      ]);

      if (!promise[0]) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
      }

      if (!promise[1]) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
      }

      if (promise[1] && promise[0].bookmarks.indexOf(promise[1]._id) === -1) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
      }

      return res.status(httpStatus.OK).json({
        _id: promise[0]._id,
        bookmark: {
          _id: promise[1]._id,
          title: promise[1].title,
          text: promise[1].text
        }
      });
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json(err);
    }
  },
  getBookmarkedPosts: async function getBookmarkedPosts(req, res) {
    try {
      const userWithBokkmarks = await User.findById(req.user._id).populate(
        "bookmarks"
      );
      if (!userWithBokkmarks) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
      }

      const bookmarks = userWithBokkmarks.bookmarks.reduce((arr, post) => {
        arr.push({ _id: post._id, title: post.title });
        return arr;
      }, []);
      return res
        .status(httpStatus.OK)
        .json({ _id: userWithBokkmarks._id, bookmarks });
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json(err);
    }
  }
};
