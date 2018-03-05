const httpStatus = require("http-status");
const Post = require("../models/postModel");
const User = require("../models/userModel");

async function createPost(req, res) {
  try {
    const post = await Post.createPost(req.body, req.user._id);

    return res.status(httpStatus.CREATED).json(post);
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

async function getPostById(req, res) {
  try {
    const promise = await Promise.all([
      User.findById(req.user._id),
      Post.findById(req.params.postId).populate("user")
    ]);
    const post = promise[1];

    const liked = promise[0].commitLikes.isPostLiked(req.params.postId);
    const bookmarked = promise[0].commitBookmark.isPostBookmarked(post._id);

    return res
      .status(httpStatus.OK)
      .json({ ...post.toJSON(), liked, bookmarked });
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

async function getAllPosts(req, res) {
  try {
    const promise = await Promise.all([
      User.findById(req.user._id),
      Post.list({
        skip: parseInt(req.query.skip, 0),
        limit: parseInt(req.query.limit, 0)
      })
    ]);

    const posts = promise[1].reduce((arr, post) => {
      const liked = promise[0].commitLikes.isPostLiked(post._id);
      const bookmarked = promise[0].commitBookmark.isPostBookmarked(post._id);
      arr.push({ ...post.toJSON(), liked, bookmarked });
      return arr;
    }, []);

    return res.status(httpStatus.OK).json(posts);
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.send(httpStatus.BAD_REQUEST);
    }

    if (!post.user.equals(req.user._id)) {
      return res.send(httpStatus.UNAUTHORIZED);
    }

    Object.keys(req.body).forEach(key => {
      post[key] = req.body[key];
    });

    return res.status(httpStatus.OK).json(await post.save());
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.send(httpStatus.BAD_REQUEST);
    }

    if (!post.user.equals(req.user._id)) {
      return res.send(httpStatus.UNAUTHORIZED);
    }

    await post.remove();

    return res.sendStatus(httpStatus.OK);
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

async function likedPost(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.send(httpStatus.BAD_REQUEST);
    }

    await user.commitLikes.aPost(req.params.id);
    return res.sendStatus(httpStatus.OK);
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

async function bookmarkPost(req, res) {
  try {
    const user = await findById(req.user._id);
    if (!user) {
      return res.send(httpStatus.BAD_REQUEST);
    }

    await user.commitBookmark.aPost(req.params.id);
    return res.sendStatus(httpStatus.OK);
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
}

module.exports = {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
  likedPost,
  bookmarkPost
};
