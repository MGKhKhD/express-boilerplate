const mongoose = require("mongoose");
const Slug = require("slug");
const mongooseValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title should be at least 3 characters"],
      unique: true
    },
    text: {
      type: String,
      trim: true,
      required: [true, "Text is required"],
      minlength: [5, "Add longer text!"]
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    likeCounts: {
      type: Number,
      default: 0
    },
    bookmarkCounts: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

schema.pre("validate", function(next) {
  this.slugify();
  next();
});

schema.plugin(mongooseValidator, {
  message: "{VALUE} is already taken!"
});

schema.methods = {
  slugify: function slugify() {
    this.slug = Slug(this.title);
  },
  toJSON: function toJSON() {
    return {
      _id: this._id,
      createdAt: this.createdAt,
      text: this.text,
      title: this.title,
      user: this.user,
      likeCounts: this.likeCounts,
      bookmarkCounts: this.bookmarkCounts,
      slug: this.slug
    };
  }
};

schema.statics = {
  createPost: function createPost(args, user) {
    return this.create({ ...args, user });
  },
  list: function list({ skip = 0, limit = 5 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user");
  },
  increaseLikeCounts: function increaseLikeCounts(id) {
    return this.findByIdAndUpdate(id, { $inc: { likeCounts: 1 } });
  },
  decreaseLikeCounts: function decreaseLikeCounts(id) {
    return this.findByIdAndUpdate(id, { $inc: { likeCounts: -1 } });
  },
  increaseBookmarkCounts: function increaseBookmarkCounts(id) {
    return this.findByIdAndUpdate(id, { $inc: { bookmarkCounts: 1 } });
  },
  decreaseBookmarkCounts: function decreaseBookmarkCounts(id) {
    return this.findByIdAndUpdate(id, { $inc: { bookmarkCounts: -1 } });
  }
};

module.exports = mongoose.model("Post", schema);
