const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const mongooseValidator = require("mongoose-unique-validator");

const constants = require("../configs/constants");
const Post = require("./postModel");

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: "{VALUE} is not a valid email"
      }
    },
    firstName: {
      type: String,
      required: [true, "Firstname is required"],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      validate: {
        validator(password) {
          let passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,}/;
          return passwordReg.test(password);
        },
        message: "{VALUE} is a not a valid password"
      }
    },
    likes: {
      posts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post"
        }
      ]
    }
  },
  { timestamps: true }
);

schema.plugin(mongooseValidator, {
  message: "{VALUE} is already taken!"
});

schema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = this.hashPassword(this.password);
    return next();
  }
  return next();
});

schema.methods = {
  hashPassword: function hashPassword(password) {
    return bcrypt.hashSync(password);
  },
  authenticateUser: function authenticateUser(password) {
    return bcrypt.compareSync(password, this.password);
  },
  createToken: function createToken() {
    return jwt.sign(
      {
        _id: this._id
      },
      constants.JWT_SECRET
    );
  },
  toJSON: function toJSON() {
    return {
      _id: this._id,
      userName: this.userName
    };
  },
  toAuthJSON: function toJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      token: `JWT ${this.createToken()}`
    };
  },

  commitLikes: {
    aPost: async function aPost(postId) {
      if (this.likes.posts.indexOf(postId) >= 0) {
        this.likes.posts.remove(postId);
        await Post.decreaseLikeCounts(postId);
      } else {
        this.likes.posts.push(postId);
        await Post.increaseLikeCounts(postId);
      }
      return this.save();
    },
    isPostLiked: function isPostLiked(postId) {
      if (this.likes.posts.indexOf(postId) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }
};

module.exports = mongoose.model("User", schema);
